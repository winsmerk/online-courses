import { AdminUserManager } from "@/components/admin-user-manager";

export default function AdminUsersPage() {
  return (
    <>
      <div className="dashboard-top">
        <div>
          <h1>管理员账号</h1>
          <p>创建后台管理员账号，并在需要时重设密码。</p>
        </div>
      </div>
      <AdminUserManager />
    </>
  );
}
