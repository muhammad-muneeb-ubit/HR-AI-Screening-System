export default function NotFoundPage() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Page not found</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">This page does not exist</h2>
      <p className="mt-2 text-sm text-slate-600">Please use the sidebar to navigate back to the app.</p>
    </div>
  );
}
