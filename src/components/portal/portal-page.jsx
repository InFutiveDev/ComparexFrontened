export function PortalPage({ title, description, children }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
        ) : null}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {children || (
          <p className="text-sm text-slate-500">
            This section is ready for your portal content. More tools will appear here soon.
          </p>
        )}
      </div>
    </div>
  );
}
