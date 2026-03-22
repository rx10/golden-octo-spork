import { logout } from "@/actions/auth";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="max-w-md w-full bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant/20">
        <h1 className="text-3xl font-bold font-headline mb-4">Dashboard</h1>
        <p className="text-on-surface-variant font-body mb-8">
          Welcome to your secure dashboard! You are successfully authenticated.
        </p>
        
        <form action={logout}>
          <button
            type="submit"
            className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline font-bold py-3 px-4 rounded-md transition-colors duration-200 border border-outline-variant/30"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
