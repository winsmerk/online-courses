export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="正在加载管理中心">
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
