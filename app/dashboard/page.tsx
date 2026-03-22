import AppLayout from "@/components/AppLayout";
import { listApplications, getApplicationStats } from "@/actions/application";
import { getProfile } from "@/actions/profile";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Application, ApplicationStats } from "@/lib/types";

const STATUS_CONFIG: Record<
  Application["status"],
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-surface-container text-on-surface-variant" },
  submitted: { label: "Submitted", color: "bg-primary-container text-primary" },
  viewed: { label: "Viewed", color: "bg-tertiary-container text-on-tertiary-container" },
  interview: { label: "Interview", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600" },
  offer: { label: "Offer", color: "bg-amber-100 text-amber-700" },
};

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="text-sm font-body">{title}</span>
      </div>
      <p className="text-3xl font-bold font-headline text-on-surface">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  if (params?.token) {
    await createSession(params.token);
    redirect("/dashboard");
  }

  const [stats, applications, profile] = await Promise.all([
    getApplicationStats(),
    listApplications(),
    getProfile(),
  ]);

  const safeStats: ApplicationStats = stats ?? {
    pending: 0,
    submitted: 0,
    viewed: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  };

  const totalApps =
    safeStats.submitted + safeStats.viewed + safeStats.interview +
    safeStats.rejected + safeStats.offer + safeStats.pending;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-headline text-on-surface">
              Dashboard
            </h1>
            {profile && (
              <p className="text-on-surface-variant font-body text-sm mt-1">
                Track your job search progress
              </p>
            )}
          </div>
          <Link
            href="/resumes/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Generate Resume
          </Link>
        </div>

        {/* Profile incomplete banner */}
        {!profile && (
          <div className="mb-6 bg-primary-container border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <div className="flex-1">
              <p className="text-sm font-body text-primary font-medium">
                Complete your profile to get started
              </p>
              <p className="text-xs text-primary/70 mt-0.5">
                Add your experience, education, and skills so we can generate tailored resumes.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="shrink-0 bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-headline font-semibold hover:bg-primary-dim transition-colors"
            >
              Set up profile
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Submitted" value={safeStats.submitted} icon="send" />
          <StatCard title="Viewed" value={safeStats.viewed} icon="visibility" />
          <StatCard title="Interviews" value={safeStats.interview} icon="handshake" />
          <StatCard title="Offers" value={safeStats.offer} icon="celebration" />
        </div>

        {/* Applications table */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <div>
              <h2 className="font-headline font-semibold text-on-surface">
                Recent Applications
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {totalApps} total
              </p>
            </div>
            {applications.length > 0 && (
              <span className="text-xs text-on-surface-variant font-body">
                Showing {applications.length}
              </span>
            )}
          </div>

          {applications.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">
                work_outline
              </span>
              <p className="mt-3 font-headline font-semibold text-on-surface">
                No applications yet
              </p>
              <p className="text-sm text-on-surface-variant font-body mt-1">
                Generate a tailored resume to start applying
              </p>
              <Link
                href="/resumes/new"
                className="mt-4 inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Generate Resume
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="text-left px-6 py-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                      Job
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                      Resume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-on-surface">
                          {app.job_title ?? "Job Application"}
                        </p>
                        {app.company_name && (
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {app.company_name}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant hidden sm:table-cell">
                        {formatDate(app.submitted_at)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/resumes/${app.resume_id}`}
                          className="text-primary text-xs font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
