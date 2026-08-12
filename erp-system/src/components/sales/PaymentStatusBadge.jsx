"use client";

export default function PaymentStatusBadge({
  status,
}) {
  const styles = {
    paid:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10",

    partial:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10",

    unpaid:
      "bg-red-50 text-red-700 ring-1 ring-red-600/10",
  };

  const labels = {
    paid: "Paid",
    partial: "Partial",
    unpaid: "Unpaid",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}