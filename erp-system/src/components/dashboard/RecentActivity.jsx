const activities = [
  {
    title: "New employee added",
    description: "John Doe was added to the HR department.",
    time: "10 minutes ago",
  },
  {
    title: "New sale recorded",
    description: "Invoice #INV-1024 was created.",
    time: "32 minutes ago",
  },
  {
    title: "Purchase order created",
    description: "PO #PO-2048 was created.",
    time: "1 hour ago",
  },
  {
    title: "Inventory updated",
    description: "Product stock quantities were updated.",
    time: "2 hours ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Recent Activity
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Latest activity across the system
        </p>
      </div>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div
            key={activity.title}
            className="flex gap-3"
          >
            <div className="relative flex flex-col items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />

              {index !== activities.length - 1 && (
                <div className="mt-1 h-full w-px bg-slate-200" />
              )}
            </div>

            <div className="-mt-1 flex-1">
              <p className="text-sm font-medium text-slate-800">
                {activity.title}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {activity.description}
              </p>

              <p className="mt-1 text-[11px] text-slate-300">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}