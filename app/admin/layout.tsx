import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DemoBanner } from "@/components/demo-banner";
import { requireAdmin } from "@/lib/viewer";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const viewer = await requireAdmin();

  return (
    <>
      <DemoBanner />
      <DashboardShell viewer={viewer}>{children}</DashboardShell>
    </>
  );
}
