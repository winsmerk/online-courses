import { AdminUserManager } from "@/components/admin-user-manager";

export default function AdminUsersPage() {
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>账号管理</h1>
          <p>创建学员或管理员账号，并在需要时重设密码。</p>
        </div>
      </div>
      <AdminUserManager />
    </>
  );
}
