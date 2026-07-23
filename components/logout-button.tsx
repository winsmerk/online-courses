"use client";

import { useState, type ReactNode } from "react";
import { signOut } from "@/app/actions/auth";

export function LogoutButton({ icon }: { icon: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="sidebar-action" type="button" onClick={() => setOpen(true)}>
        {icon} 退出登录
      </button>
      {open && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="logout-title">确认退出登录？</h2>
            <p>退出后需要重新输入邮箱和密码才能进入学习与管理中心。</p>
            <div className="modal-actions">
              <button
                className="button secondary"
                type="button"
                onClick={() => setOpen(false)}
              >
                取消
              </button>
              <form action={signOut}>
                <button className="button danger" type="submit">
                  确认退出
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
