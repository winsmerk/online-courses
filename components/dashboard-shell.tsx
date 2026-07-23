import Link from "next/link";
import type { ReactNode } from "react";
import type { Viewer } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";
import { DashboardNav } from "@/components/dashboard-nav";

export function DashboardShell({
  viewer,
  children,
}: {
  viewer: Viewer;
  children: ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="brand-logo-link" aria-label="Beyond Wild">
          <BrandLogo priority />
        </Link>
        <DashboardNav role={viewer.role} />
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
