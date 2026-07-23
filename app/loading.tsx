export default function Loading() {
  return (
    <div className="page-loading-state" aria-live="polite">
      <span className="page-loading-spinner" />
      <p>页面加载中，请稍候…</p>
    </div>
  );
}
