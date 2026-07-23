"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { KeyRound, LoaderCircle, Plus, RefreshCw } from "lucide-react";

type ManagedUser = {
  id: string;
  email: string;
  displayName: string;
  role: "student" | "admin";
  createdAt: string;
  lastSignInAt?: string | null;
};

export function AdminUserManager() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetUser, setResetUser] = useState<ManagedUser | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "账号列表加载失败");
    else setUsers(result.users);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.get("displayName"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "账号创建失败");
    } else {
      event.currentTarget.reset();
      setMessage("账号已创建，用户可立即使用邮箱和密码登录。");
      await loadUsers();
    }
    setSubmitting(false);
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetUser) return;
    setSubmitting(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: resetUser.id,
        password: resetPassword,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "密码重设失败");
    } else {
      setMessage(`已重设 ${resetUser.email} 的密码。`);
      setResetUser(null);
      setResetPassword("");
    }
    setSubmitting(false);
  }

  return (
    <div className="user-manager">
      <section className="admin-panel">
        <div>
          <span className="eyebrow">Create account</span>
          <h2>创建登录账号</h2>
          <p>邮箱会自动确认，不发送注册邮件。请通过安全方式把密码交给用户。</p>
        </div>
        <form className="user-create-form" onSubmit={createUser}>
          <label>
            姓名
            <input name="displayName" required placeholder="例如：陈默" />
          </label>
          <label>
            邮箱
            <input name="email" type="email" required placeholder="name@example.com" />
          </label>
          <label>
            初始密码
            <input
              name="password"
              type="password"
              minLength={8}
              required
              placeholder="至少 8 位"
            />
          </label>
          <label>
            账号类型
            <select name="role" defaultValue="student">
              <option value="student">普通学员</option>
              <option value="admin">管理员</option>
            </select>
          </label>
          <button className="button dark" disabled={submitting} type="submit">
            {submitting ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}
            创建账号
          </button>
        </form>
      </section>

      {(message || error) && (
        <p className={`form-notice ${error ? "error" : "success"}`}>
          {error || message}
        </p>
      )}

      <section className="admin-panel user-list-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Users</span>
            <h2>现有账号</h2>
          </div>
          <button className="icon-button" onClick={() => void loadUsers()} title="刷新">
            <RefreshCw size={17} />
          </button>
        </div>
        {loading ? (
          <p className="empty-state"><LoaderCircle className="spin" size={18} /> 正在加载…</p>
        ) : (
          <div className="user-table-wrap">
            <table className="user-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>角色</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.displayName}</strong>
                      <span>{user.email}</span>
                    </td>
                    <td>
                      <span className="role-badge">
                        {user.role === "admin" ? "管理员" : "普通学员"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("zh-CN")}</td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => setResetUser(user)}
                      >
                        <KeyRound size={15} /> 重设密码
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {resetUser && (
        <div className="modal-backdrop" onMouseDown={() => setResetUser(null)}>
          <form
            className="password-modal"
            onSubmit={updatePassword}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2>重设密码</h2>
            <p>{resetUser.email}</p>
            <label>
              新密码
              <input
                type="password"
                minLength={8}
                required
                autoFocus
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                placeholder="至少 8 位"
              />
            </label>
            <div className="modal-actions">
              <button className="button secondary" type="button" onClick={() => setResetUser(null)}>
                取消
              </button>
              <button className="button dark" type="submit" disabled={submitting}>
                确认重设
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
