import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardShell({
  children,
  user,
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Header user={user} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}