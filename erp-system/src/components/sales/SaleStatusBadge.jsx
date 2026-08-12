"use client";

export default function SaleStatusBadge({status,}) {
  const styles = {
    completed:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10",
    pending:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10",
    cancelled:
      "bg-red-50 text-red-700 ring-1 ring-red-600/10",
  };

  const labels = {
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
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