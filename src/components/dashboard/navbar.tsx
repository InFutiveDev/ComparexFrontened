type NavbarProps = {
  onOpenMenu: () => void;
};

export function DashboardNavbar({ onOpenMenu }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm lg:hidden"
          >
            Menu
          </button>
          <h1 className="text-base font-semibold sm:text-lg">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 sm:block">Search leads...</div>
          <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">AK</div>
        </div>
      </div>
    </header>
  );
}
