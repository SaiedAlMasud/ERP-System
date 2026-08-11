export default function ProductStatusBadge({
  status,
}) {
  const styles = {
    active:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10",

    inactive:
      "bg-slate-100 text-slate-600 ring-1 ring-slate-500/10",
  };

  const labels = {
    active: "Active",
    inactive: "Inactive",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

      {labels[status] || status}
    </span>
  );
}