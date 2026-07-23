import { AdminCourseEditor } from "@/components/admin-course-editor";
import { requireAdmin } from "@/lib/viewer";

export default async function NewCoursePage() {
  const viewer = await requireAdmin();
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>新建课程</h1>
          <p>填写课程信息，并按章节上传视频内容。</p>
        </div>
      </div>
      <AdminCourseEditor demo={Boolean(viewer.demo)} />
    </>
  );
}
