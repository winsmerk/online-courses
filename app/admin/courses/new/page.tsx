import { AdminCourseEditor } from "@/components/admin-course-editor";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoBanner } from "@/components/demo-banner";
import { requireAdmin } from "@/lib/viewer";

export default async function NewCoursePage() {
  const viewer = await requireAdmin();
  return (
    <>
      <DemoBanner />
      <DashboardShell viewer={viewer} active="admin">
        <div className="dashboard-top">
          <div>
            <h1>新建课程</h1>
            <p>填写课程信息，并按章节上传视频内容。</p>
          </div>
        </div>
        <AdminCourseEditor demo={Boolean(viewer.demo)} />
      </DashboardShell>
    </>
  );
}
