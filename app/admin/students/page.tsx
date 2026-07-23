import { AdminStudentManager } from "@/components/admin-student-manager";

export default function AdminStudentsPage() {
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>学员管理</h1>
          <p>创建普通学员账号，并为每位学员分配一门或多门课程。</p>
        </div>
      </div>
      <AdminStudentManager />
    </>
  );
}
