import { getServerI18n } from "@/lib/i18n-server";

export default async function Loading() {
  const { t } = await getServerI18n();
  return (
    <div className="page-loading-state" aria-live="polite">
      <span className="page-loading-spinner" />
      <p>{t("页面加载中，请稍候…")}</p>
    </div>
  );
}
