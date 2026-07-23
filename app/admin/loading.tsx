import { getServerI18n } from "@/lib/i18n-server";

export default async function AdminLoading() {
  const { t } = await getServerI18n();
  return (
    <div aria-busy="true" aria-label={t("正在加载管理中心")}>
      <div className="navigation-progress visible" role="progressbar" />
      <div className="dashboard-loading-title" />
      <div className="dashboard-loading-stats">
        <span />
        <span />
        <span />
      </div>
      <div className="dashboard-loading-row" />
      <div className="dashboard-loading-row" />
    </div>
  );
}
