"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  BookPlus,
  Check,
  KeyRound,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

type Student = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastSignInAt?: string | null;
  courseIds: string[];
};

type AssignableCourse = {
  id: string;
  title: string;
  status: "published";
};

export function AdminStudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<AssignableCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [assigningStudent, setAssigningStudent] = useState<Student | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [resetStudent, setResetStudent] = useState<Student | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const { t } = useLanguage();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/students", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(t(result.error ?? "学员列表加载失败"));
      }
      setStudents(result.students);
      setCourses(result.courses);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : t("学员列表加载失败"),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return students;
    return students.filter(
      (student) =>
        student.displayName.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword),
    );
  }, [query, students]);

  async function createStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.get("displayName"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(t(result.error ?? "学员账号创建失败"));
      }
      event.currentTarget.reset();
      setMessage(t("学员账号已创建，可立即分配课程。"));
      await loadStudents();
    } catch (createError) {
      setError(
        createError instanceof Error ? createError.message : t("学员账号创建失败"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openAssignment(student: Student) {
    setAssigningStudent(student);
    setSelectedCourseIds(student.courseIds);
    setMessage("");
    setError("");
  }

  function toggleCourse(courseId: string) {
    setSelectedCourseIds((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId],
    );
  }

  async function saveAssignments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assigningStudent) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignCourses",
          userId: assigningStudent.id,
          courseIds: selectedCourseIds,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(t(result.error ?? "课程分配失败"));
      setMessage(
        t("已更新 {name} 的课程权限。", {
          name: assigningStudent.displayName,
        }),
      );
      setAssigningStudent(null);
      await loadStudents();
    } catch (assignmentError) {
      setError(
        assignmentError instanceof Error
          ? assignmentError.message
          : t("课程分配失败"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetStudent) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resetPassword",
          userId: resetStudent.id,
          password: resetPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(t(result.error ?? "密码重设失败"));
      setMessage(t("已重设 {email} 的密码。", { email: resetStudent.email }));
      setResetStudent(null);
      setResetPassword("");
    } catch (passwordError) {
      setError(
        passwordError instanceof Error ? passwordError.message : t("密码重设失败"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const courseTitleMap = useMemo(
    () => new Map(courses.map((course) => [course.id, course.title])),
    [courses],
  );

  return (
    <div className="user-manager">
      <section className="admin-panel">
        <div>
          <span className="eyebrow">Student account</span>
          <h2>{t("创建学员账号")}</h2>
          <p>{t("账号创建后邮箱会自动确认，学员可使用邮箱和初始密码登录。")}</p>
        </div>
        <form
          className="user-create-form student-create-form"
          onSubmit={createStudent}
        >
          <label>
            {t("姓名")}
            <input name="displayName" required placeholder={t("例如：陈默")} />
          </label>
          <label>
            {t("邮箱")}
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </label>
          <label>
            {t("初始密码")}
            <input
              name="password"
              type="password"
              minLength={8}
              required
              placeholder={t("至少 8 位")}
            />
          </label>
          <button className="button dark" disabled={submitting} type="submit">
            {submitting ? (
              <LoaderCircle className="spin" size={16} />
            ) : (
              <Plus size={16} />
            )}
            {t("创建学员")}
          </button>
        </form>
      </section>

      {(message || error) && (
        <p className={`form-notice ${error ? "error" : "success"}`}>
          {error || message}
        </p>
      )}

      <section className="admin-panel user-list-panel">
        <div className="panel-heading student-list-heading">
          <div>
            <span className="eyebrow">Students</span>
            <h2>{t("普通学员")}</h2>
          </div>
          <div className="student-list-tools">
            <label className="student-search">
              <Search size={16} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("搜索姓名或邮箱")}
                aria-label={t("搜索学员")}
              />
            </label>
            <button
              className="icon-button"
              onClick={() => void loadStudents()}
              title={t("刷新")}
              aria-label={t("刷新学员列表")}
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">
            <LoaderCircle className="spin" size={18} /> {t("正在加载")}…
          </p>
        ) : filteredStudents.length === 0 ? (
          <p className="empty-state">{t("暂无符合条件的学员。")}</p>
        ) : (
          <div className="student-card-list">
            {filteredStudents.map((student) => (
              <article className="student-account-card" key={student.id}>
                <div className="student-account-main">
                  <span className="student-avatar" aria-hidden="true">
                    {student.displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <h3>{student.displayName}</h3>
                    <p>{student.email}</p>
                  </div>
                </div>
                <div className="student-course-summary">
                  <span>
                    {t("已分配 {count} 门课程", {
                      count: student.courseIds.length,
                    })}
                  </span>
                  <div className="student-course-tags">
                    {student.courseIds.length ? (
                      student.courseIds.slice(0, 3).map((courseId) => (
                        <span key={courseId}>
                          {courseTitleMap.get(courseId) ?? t("课程")}
                        </span>
                      ))
                    ) : (
                      <em>{t("尚未分配课程")}</em>
                    )}
                    {student.courseIds.length > 3 && (
                      <span>+{student.courseIds.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="student-account-actions">
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => openAssignment(student)}
                  >
                    <BookPlus size={15} /> {t("分配课程")}
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setResetStudent(student);
                      setMessage("");
                      setError("");
                    }}
                  >
                    <KeyRound size={15} /> {t("重设密码")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {assigningStudent && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setAssigningStudent(null)}
        >
          <form
            className="password-modal course-assignment-modal"
            onSubmit={saveAssignments}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-assignment-title"
          >
            <h2 id="course-assignment-title">{t("分配课程")}</h2>
            <p>
              {assigningStudent.displayName} ·{" "}
              {t("已选择 {count} 门", { count: selectedCourseIds.length })}
            </p>
            <div className="course-assignment-list">
              {courses.length ? (
                courses.map((course) => {
                  const checked = selectedCourseIds.includes(course.id);
                  return (
                    <label
                      className={`course-assignment-option ${
                        checked ? "selected" : ""
                      }`}
                      key={course.id}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCourse(course.id)}
                      />
                      <span className="course-assignment-check">
                        {checked && <Check size={14} />}
                      </span>
                      <span>{course.title}</span>
                    </label>
                  );
                })
              ) : (
                <p className="empty-state">{t("暂无已发布课程，请先发布课程。")}</p>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="button secondary"
                type="button"
                onClick={() => setAssigningStudent(null)}
              >
                {t("取消")}
              </button>
              <button className="button dark" type="submit" disabled={submitting}>
                {submitting && <LoaderCircle className="spin" size={16} />}
                {t("保存分配")}
              </button>
            </div>
          </form>
        </div>
      )}

      {resetStudent && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setResetStudent(null)}
        >
          <form
            className="password-modal"
            onSubmit={updatePassword}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-password-title"
          >
            <h2 id="student-password-title">{t("重设学员密码")}</h2>
            <p>{resetStudent.email}</p>
            <label>
              {t("新密码")}
              <input
                type="password"
                minLength={8}
                required
                autoFocus
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                placeholder={t("至少 8 位")}
              />
            </label>
            <div className="modal-actions">
              <button
                className="button secondary"
                type="button"
                onClick={() => setResetStudent(null)}
              >
                {t("取消")}
              </button>
              <button className="button dark" type="submit" disabled={submitting}>
                {t("确认重设")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
