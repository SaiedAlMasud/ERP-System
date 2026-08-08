import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType = "positive",
}) {
  const isPositive = trendType === "positive";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Icon
            size={19}
            className="text-slate-700"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              isPositive
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {trend}
          </span>
        )}

        {description && (
          <span className="text-xs text-slate-400">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}