import { notFound } from "next/navigation";
import { AdminCourseEditor } from "@/components/admin-course-editor";
import { getCourseById } from "@/lib/data";
import { getServerI18n } from "@/lib/i18n-server";
import { requireAdmin } from "@/lib/viewer";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await requireAdmin();
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();
  const { t } = await getServerI18n();

  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>{t("编辑课程")}</h1>
          <p>{t("修改课程信息、章节、视频和附件。")}</p>
        </div>
      </div>
      <AdminCourseEditor demo={Boolean(viewer.demo)} initialCourse={course} />
    </>
  );
}
