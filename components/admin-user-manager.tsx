"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { KeyRound, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

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
  const { t, locale } = useLanguage();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) setError(t(result.error ?? "账号列表加载失败"));
    else {
      setUsers(
        (result.users as ManagedUser[]).filter((user) => user.role === "admin"),
      );
    }
    setLoading(false);
  }, [t]);

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
        role: "admin",
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(t(result.error ?? "账号创建失败"));
    } else {
      event.currentTarget.reset();
      setMessage(t("账号已创建，用户可立即使用邮箱和密码登录。"));
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
      setError(t(result.error ?? "密码重设失败"));
    } else {
      setMessage(t("已重设 {email} 的密码。", { email: resetUser.email }));
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
          <h2>{t("创建管理员账号")}</h2>
          <p>{t("管理员可以管理课程与学员。邮箱会自动确认，不发送注册邮件。")}</p>
        </div>
        <form
          className="user-create-form admin-account-create-form"
          onSubmit={createUser}
        >
          <label>
            {t("姓名")}
            <input name="displayName" required placeholder={t("例如：陈默")} />
          </label>
          <label>
            {t("邮箱")}
            <input name="email" type="email" required placeholder="name@example.com" />
          </label>
          <label>
            {t("初始密码")}
            <input
              name="password"
              type="password"
              minLength={8}
              required
              placeholder={t("至少 8 位")}
            />
          </label>
          <button className="button dark" disabled={submitting} type="submit">
            {submitting ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}
            {t("创建账号")}
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
            <h2>{t("管理员列表")}</h2>
          </div>
          <button className="icon-button" onClick={() => void loadUsers()} title={t("刷新")}>
            <RefreshCw size={17} />
          </button>
        </div>
        {loading ? (
          <p className="empty-state"><LoaderCircle className="spin" size={18} /> {t("正在加载")}…</p>
        ) : (
          <div className="user-table-wrap">
            <table className="user-table">
              <thead>
                <tr>
                  <th>{t("用户")}</th>
                  <th>{t("角色")}</th>
                  <th>{t("创建时间")}</th>
                  <th>{t("操作")}</th>
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
                        {user.role === "admin" ? t("管理员") : t("普通学员")}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "zh-CN")}</td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => setResetUser(user)}
                      >
                        <KeyRound size={15} /> {t("重设密码")}
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
            <h2>{t("重设密码")}</h2>
            <p>{resetUser.email}</p>
            <label>
              {t("新密码")}
              <input
                type="password"
                minLength={8}
                required
                autoFocus
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                placeholder={t("至少 8 位")}
              />
            </label>
            <div className="modal-actions">
              <button className="button secondary" type="button" onClick={() => setResetUser(null)}>
                {t("取消")}
              </button>
              <button className="button dark" type="submit" disabled={submitting}>
                {t("确认重设")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
