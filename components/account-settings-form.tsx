"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function AccountSettingsForm({
  userId,
  initialName,
  email,
}: {
  userId: string;
  initialName: string;
  email: string;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const displayName = String(form.get("displayName") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (password && password !== confirmPassword) {
      setError("两次输入的新密码不一致。");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("账号服务尚未配置。");
      setSaving(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", userId);
    if (profileError) {
      setError(profileError.message);
      setSaving(false);
      return;
    }

    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
        data: { display_name: displayName },
      });
      if (passwordError) {
        setError(passwordError.message);
        setSaving(false);
        return;
      }
    } else {
      await supabase.auth.updateUser({ data: { display_name: displayName } });
    }

    event.currentTarget.reset();
    setMessage("账号信息已保存。");
    setSaving(false);
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <section className="admin-panel">
        <span className="eyebrow">Profile</span>
        <h2>基本信息</h2>
        <div className="settings-grid">
          <label>
            显示名称
            <input
              name="displayName"
              defaultValue={initialName}
              minLength={1}
              required
            />
          </label>
          <label>
            登录邮箱
            <input value={email} disabled aria-label="登录邮箱" />
          </label>
        </div>
      </section>
      <section className="admin-panel">
        <span className="eyebrow">Password</span>
        <h2>修改密码</h2>
        <p>不需要修改密码时保持为空即可。</p>
        <div className="settings-grid">
          <label>
            新密码
            <input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder="至少 8 位"
            />
          </label>
          <label>
            确认新密码
            <input
              name="confirmPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder="再次输入新密码"
            />
          </label>
        </div>
      </section>
      {(message || error) && (
        <p className={`form-notice ${error ? "error" : "success"}`}>
          {error || message}
        </p>
      )}
      <button className="button dark" disabled={saving} type="submit">
        {saving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}
        保存账号设置
      </button>
    </form>
  );
}
