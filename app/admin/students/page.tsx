import { AdminStudentManager } from "@/components/admin-student-manager";
import { getServerI18n } from "@/lib/i18n-server";

export default async function AdminStudentsPage() {
  const { t } = await getServerI18n();
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>{t("学员管理")}</h1>
          <p>{t("创建普通学员账号，并为每位学员分配一门或多门课程。")}</p>
        </div>
      </div>
      <AdminStudentManager />
    </>
  );
}
