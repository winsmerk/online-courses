import { AdminCourseEditor } from "@/components/admin-course-editor";
import { getServerI18n } from "@/lib/i18n-server";
import { requireAdmin } from "@/lib/viewer";

export default async function NewCoursePage() {
  const viewer = await requireAdmin();
  const { t } = await getServerI18n();
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>{t("新建课程")}</h1>
          <p>{t("填写课程信息，并按章节上传视频内容。")}</p>
        </div>
      </div>
      <AdminCourseEditor demo={Boolean(viewer.demo)} />
    </>
  );
}
