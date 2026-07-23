import Link from "next/link";
import { PublicNav } from "@/components/public-nav";
import { getServerI18n } from "@/lib/i18n-server";
import { getViewer } from "@/lib/viewer";

export async function Header({ dark = true }: { dark?: boolean }) {
  const viewer = await getViewer();
  const { t } = await getServerI18n();

  return (
    <>
      <header
        className="site-header"
        style={{ color: dark ? "white" : "var(--ink)" }}
      >
        <div className="shell site-header-inner">
          <Link
            href="/"
            className="logo"
            aria-label={`Beyond Wild ${t("首页")}`}
          >
            <span className="logo-mark">B</span>
            <span>Beyond Wild</span>
          </Link>
          <PublicNav
            signedIn={Boolean(viewer)}
            isAdmin={viewer?.role === "admin"}
          />
        </div>
      </header>
      <div className="site-header-spacer" aria-hidden="true" />
    </>
  );
}
