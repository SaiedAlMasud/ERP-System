import {
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";

const inventoryItems = [
  {
    label: "In Stock",
    value: "1,248",
    icon: CheckCircle2,
  },
  {
    label: "Low Stock",
    value: "32",
    icon: AlertTriangle,
  },
  {
    label: "Total Products",
    value: "1,580",
    icon: Package,
  },
];

export default function InventorySummary() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Inventory Summary
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Current inventory status
        </p>
      </div>

      <div className="space-y-3">
        {inventoryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                  <Icon
                    size={17}
                    className="text-slate-500"
                  />
                </div>

                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>
              </div>

              <span className="text-sm font-bold text-slate-900">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}