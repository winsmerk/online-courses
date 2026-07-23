"use client";

import { useState } from "react";
import { Plus, Save, Trash2, UploadCloud } from "lucide-react";
import * as tus from "tus-js-client";
import { createClient } from "@/lib/supabase/browser";
import type { Course } from "@/lib/types";

type LessonDraft = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoPath?: string | null;
  videoFile?: File;
  attachmentFiles?: File[];
  existingAttachments?: Array<{
    id: string;
    filename: string;
    storagePath: string;
    sizeBytes?: number;
    mimeType?: string;
  }>;
};

type ChapterDraft = {
  id: string;
  title: string;
  lessons: LessonDraft[];
};

const makeLesson = (): LessonDraft => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  durationMinutes: 15,
});

const makeChapter = (): ChapterDraft => ({
  id: crypto.randomUUID(),
  title: "",
  lessons: [makeLesson()],
});

function getVideoContentType(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "mov") return "video/quicktime";
  if (extension === "webm") return "video/webm";
  if (extension === "mp4") return "video/mp4";
  return file.type || "application/octet-stream";
}

async function uploadVideoResumable(
  file: File,
  bucketName: string,
  objectName: string,
) {
  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabase || !supabaseUrl) throw new Error("Supabase 尚未配置");

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("登录状态已失效，请重新登录");

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 1000, 3000, 5000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName,
        objectName,
        contentType: getVideoContentType(file),
        cacheControl: "3600",
      },
      onError: reject,
      onSuccess: () => resolve(),
    });

    upload
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      })
      .catch(reject);
  });
}

export function AdminCourseEditor({
  demo,
  initialCourse,
}: {
  demo: boolean;
  initialCourse?: Course;
}) {
  const [chapters, setChapters] = useState<ChapterDraft[]>(() =>
    initialCourse
      ? initialCourse.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            durationMinutes: lesson.durationMinutes,
            videoPath: lesson.videoPath,
            existingAttachments: lesson.attachments ?? [],
          })),
        }))
      : [makeChapter()],
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [introImageFiles, setIntroImageFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);

  function updateChapter(
    chapterId: string,
    updater: (chapter: ChapterDraft) => ChapterDraft,
  ) {
    setChapters((current) =>
      current.map((chapter) =>
        chapter.id === chapterId ? updater(chapter) : chapter,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (demo) {
      setStatus("演示模式不会写入数据。配置 Supabase 后即可创建课程。");
      return;
    }

    setSaving(true);
    const form = new FormData(event.currentTarget);
    const courseId = initialCourse?.id ?? crypto.randomUUID();
    const supabase = createClient();

    try {
      if (!supabase) throw new Error("Supabase 尚未配置");

      let coverUrl = initialCourse?.coverUrl ?? "";
      if (coverFile) {
        const extension = coverFile.name.split(".").pop() ?? "jpg";
        const coverPath = `${courseId}/cover.${extension}`;
        const { error } = await supabase.storage
          .from("course-images")
          .upload(coverPath, coverFile, { upsert: true });
        if (error) throw error;
        coverUrl = supabase.storage
          .from("course-images")
          .getPublicUrl(coverPath).data.publicUrl;
      }

      const introImageUrls: string[] = introImageFiles.length
        ? []
        : [...(initialCourse?.introImages ?? [])];
      for (const [index, file] of introImageFiles.entries()) {
        const extension = file.name.split(".").pop() ?? "jpg";
        const path = `${courseId}/content/${index + 1}.${extension}`;
        const { error } = await supabase.storage
          .from("course-images")
          .upload(path, file, { upsert: true });
        if (error) throw error;
        introImageUrls.push(
          supabase.storage.from("course-images").getPublicUrl(path).data
            .publicUrl,
        );
      }

      const chaptersWithVideos = [];
      for (const [chapterIndex, chapter] of chapters.entries()) {
        const lessons = [];
        for (const [lessonIndex, lesson] of chapter.lessons.entries()) {
          let videoPath = lesson.videoPath ?? "";
          if (lesson.videoFile) {
            const extension =
              lesson.videoFile.name.split(".").pop()?.toLowerCase() ?? "mp4";
            videoPath = `${courseId}/${lesson.id}.${extension}`;
            setStatus(`正在上传视频：${lesson.title || lesson.videoFile.name}`);
            await uploadVideoResumable(
              lesson.videoFile,
              "course-videos",
              videoPath,
            );
          }
          const attachments = (lesson.existingAttachments ?? []).map(
            (attachment) => ({
              id: attachment.id,
              filename: attachment.filename,
              storagePath: attachment.storagePath,
              sizeBytes: attachment.sizeBytes ?? 0,
              mimeType: attachment.mimeType ?? "application/octet-stream",
            }),
          );
          for (const file of lesson.attachmentFiles ?? []) {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
            const storagePath = `${courseId}/${lesson.id}/${crypto.randomUUID()}-${safeName}`;
            const { error } = await supabase.storage
              .from("course-files")
              .upload(storagePath, file);
            if (error) throw error;
            attachments.push({
              id: crypto.randomUUID(),
              filename: file.name,
              storagePath,
              sizeBytes: file.size,
              mimeType: file.type || "application/octet-stream",
            });
          }
          lessons.push({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            durationMinutes: lesson.durationMinutes,
            videoPath,
            sortOrder: lessonIndex + 1,
            attachments,
          });
        }
        chaptersWithVideos.push({
          id: chapter.id,
          title: chapter.title,
          sortOrder: chapterIndex + 1,
          lessons,
        });
      }

      const response = await fetch("/api/admin/courses", {
        method: initialCourse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: courseId,
          title: form.get("title"),
          slug: form.get("slug"),
          subtitle: form.get("subtitle"),
          description: form.get("description"),
          instructor: form.get("instructor"),
          category: form.get("category"),
          level: form.get("level"),
          status: form.get("status"),
          coverUrl,
          introImageUrls,
          chapters: chaptersWithVideos,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "课程保存失败");
      window.location.href = initialCourse
        ? "/admin?updated=1"
        : "/admin?created=1";
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="title">课程名称</label>
          <input
            className="input"
            id="title"
            name="title"
            defaultValue={initialCourse?.title}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="slug">URL 标识</label>
          <input
            className="input"
            id="slug"
            name="slug"
            defaultValue={initialCourse?.slug}
            placeholder="personal-brand"
            pattern="[a-z0-9-]+"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="instructor">讲师</label>
          <input
            className="input"
            id="instructor"
            name="instructor"
            defaultValue={initialCourse?.instructor}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="category">分类</label>
          <input
            className="input"
            id="category"
            name="category"
            defaultValue={initialCourse?.category}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="level">难度</label>
          <select
            className="select"
            id="level"
            name="level"
            defaultValue={initialCourse?.level ?? "入门"}
          >
            <option>入门</option>
            <option>进阶</option>
            <option>通用</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">状态</label>
          <select
            className="select"
            id="status"
            name="status"
            defaultValue={initialCourse?.status ?? "draft"}
          >
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="subtitle">一句话简介</label>
        <input
          className="input"
          id="subtitle"
          name="subtitle"
          defaultValue={initialCourse?.subtitle}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="intro-images">课程介绍图片（可多选）</label>
        <input
          className="input file-input"
          id="intro-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) =>
            setIntroImageFiles(Array.from(event.target.files ?? []))
          }
        />
        {initialCourse?.introImages.length ? (
          <p className="existing-file-note">
            当前已有 {initialCourse.introImages.length} 张介绍图片；重新选择后将整体替换。
          </p>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor="description">课程介绍</label>
        <textarea
          className="textarea"
          id="description"
          name="description"
          defaultValue={initialCourse?.description}
          placeholder="支持多段文字。课程介绍图片可作为课程封面和后续内容区扩展。"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="cover">课程封面</label>
        <input
          className="input file-input"
          id="cover"
          type="file"
          accept="image/*"
          onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
        />
        {initialCourse?.coverUrl ? (
          <p className="existing-file-note">未选择新图片时保留当前课程封面。</p>
        ) : null}
      </div>

      <section className="form-section">
        <h3>课程章节</h3>
        <p style={{ color: "#73798d", fontSize: 13 }}>
          每个章节可添加多个视频课时。
        </p>
        {chapters.map((chapter, chapterIndex) => (
          <div className="lesson-editor" key={chapter.id}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                className="input"
                aria-label={`第 ${chapterIndex + 1} 章标题`}
                placeholder={`第 ${chapterIndex + 1} 章标题`}
                value={chapter.title}
                onChange={(event) =>
                  updateChapter(chapter.id, (current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
              />
              {chapters.length > 1 && (
                <button
                  type="button"
                  aria-label="删除章节"
                  onClick={() =>
                    setChapters((current) =>
                      current.filter((item) => item.id !== chapter.id),
                    )
                  }
                  style={{ border: 0, background: "transparent", cursor: "pointer" }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            {chapter.lessons.map((lesson, lessonIndex) => (
              <div
                key={lesson.id}
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid #dde0e8",
                }}
              >
                <div className="form-grid">
                  <div className="field">
                    <label>课时 {lessonIndex + 1} 标题</label>
                    <input
                      className="input"
                      value={lesson.title}
                      onChange={(event) =>
                        updateChapter(chapter.id, (current) => ({
                          ...current,
                          lessons: current.lessons.map((item) =>
                            item.id === lesson.id
                              ? { ...item, title: event.target.value }
                              : item,
                          ),
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="field">
                    <label>时长（分钟）</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={lesson.durationMinutes}
                      onChange={(event) =>
                        updateChapter(chapter.id, (current) => ({
                          ...current,
                          lessons: current.lessons.map((item) =>
                            item.id === lesson.id
                              ? {
                                  ...item,
                                  durationMinutes: Number(event.target.value),
                                }
                              : item,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label>课时说明</label>
                  <textarea
                    className="textarea"
                    value={lesson.description}
                    onChange={(event) =>
                      updateChapter(chapter.id, (current) => ({
                        ...current,
                        lessons: current.lessons.map((item) =>
                          item.id === lesson.id
                            ? { ...item, description: event.target.value }
                            : item,
                        ),
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>课程附件（文档或压缩包，可多选）</label>
                  <input
                    className="input file-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.7z"
                    onChange={(event) =>
                      updateChapter(chapter.id, (current) => ({
                        ...current,
                        lessons: current.lessons.map((item) =>
                          item.id === lesson.id
                            ? {
                                ...item,
                                attachmentFiles: Array.from(
                                  event.target.files ?? [],
                                ),
                              }
                            : item,
                        ),
                      }))
                    }
                  />
                  {lesson.existingAttachments?.length ? (
                    <p className="existing-file-note">
                      已保留：{" "}
                      {lesson.existingAttachments
                        .map((attachment) => attachment.filename)
                        .join("、")}
                    </p>
                  ) : null}
                </div>
                <div className="field">
                  <label>
                    <UploadCloud size={15} /> 视频文件
                  </label>
                  <input
                    className="input file-input"
                    type="file"
                    accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime,video/x-quicktime"
                    onChange={(event) =>
                      updateChapter(chapter.id, (current) => ({
                        ...current,
                        lessons: current.lessons.map((item) =>
                          item.id === lesson.id
                            ? { ...item, videoFile: event.target.files?.[0] }
                            : item,
                        ),
                      }))
                    }
                  />
                  {lesson.videoPath ? (
                    <p className="existing-file-note">
                      未选择新视频时保留当前视频。
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
            <button
              className="button secondary"
              style={{ color: "var(--ink)" }}
              type="button"
              onClick={() =>
                updateChapter(chapter.id, (current) => ({
                  ...current,
                  lessons: [...current.lessons, makeLesson()],
                }))
              }
            >
              <Plus size={15} /> 添加课时
            </button>
          </div>
        ))}
        <button
          className="button secondary"
          style={{ color: "var(--ink)" }}
          type="button"
          onClick={() => setChapters((current) => [...current, makeChapter()])}
        >
          <Plus size={15} /> 添加章节
        </button>
      </section>
      {status && <p className="form-error">{status}</p>}
      <button className="button dark" type="submit" disabled={saving}>
        <Save size={16} />{" "}
        {saving
          ? "正在上传并保存…"
          : initialCourse
            ? "保存修改"
            : "保存课程"}
      </button>
    </form>
  );
}
