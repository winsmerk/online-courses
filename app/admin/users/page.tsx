import { AdminUserManager } from "@/components/admin-user-manager";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireAdmin } from "@/lib/viewer";

export default async function AdminUsersPage() {
  const viewer = await requireAdmin();

  return (
    <DashboardShell viewer={viewer} active="users">
      <div className="dashboard-top">
        <div>
          <h1>账号管理</h1>
          <p>创建学员或管理员账号，并在需要时重设密码。</p>
        </div>
      </div>
      <AdminUserManager />
    </DashboardShell>
  );
}
