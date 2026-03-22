import AppLayout from "@/components/AppLayout";
import { listResumes } from "@/actions/resume";
import Link from "next/link";
import type { Resume } from "@/lib/types";

const STATUS_COLOR: Record<Resume["status"], string> = {
  draft: "bg-surface-container text-on-surface-variant",
  generated: "bg-primary-container text-primary",
  submitted: "bg-green-100 text-green-700",
  archived: "bg-surface-container text-outline",
};

const STATUS_LABEL: Record<Resume["status"], string> = {
  draft: "Draft",
  generated: "Generated",
  submitted: "Submitted",
  archived: "Archived",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ATSBadge({ score }: { score?: number }) {
  if (score === undefined || score === null) return null;
  const color =
    score >= 80
      ? "text-green-700 bg-green-100"
      : score >= 60
      ? "text-amber-700 bg-amber-100"
      : "text-red-600 bg-red-100";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      ATS {score.toFixed(0)}
    </span>
  );
}

function ResumeCard({ resume }: { resume: Resume }) {
  return (
    <Link
      href={`/resumes/${resume.id}`}
      className="group block bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
            description
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ATSBadge score={resume.ats_score} />
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[resume.status]}`}
          >
            {STATUS_LABEL[resume.status]}
          </span>
        </div>
      </div>

      <h3 className="font-headline font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
        {resume.job_title ?? "Resume"}
      </h3>
      {resume.company_name && (
        <p className="text-sm text-on-surface-variant font-body mt-0.5">
          {resume.company_name}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant font-body">
          {formatDate(resume.created_at)}
        </span>
        <span className="text-xs text-on-surface-variant font-body">
          {resume.template_id} · v{resume.version}
        </span>
      </div>
    </Link>
  );
}

export default async function ResumesPage() {
  const resumes = await listResumes();

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-headline text-on-surface">
              My Resumes
            </h1>
            <p className="text-sm text-on-surface-variant font-body mt-1">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <Link
            href="/resumes/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Generate New
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-24 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-[64px] text-outline-variant">
              description
            </span>
            <h2 className="mt-4 text-xl font-bold font-headline text-on-surface">
              No resumes yet
            </h2>
            <p className="text-sm text-on-surface-variant font-body mt-2 max-w-sm mx-auto">
              Generate your first AI-tailored resume by pasting a job description
            </p>
            <Link
              href="/resumes/new"
              className="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Generate Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
            {/* New resume card */}
            <Link
              href="/resumes/new"
              className="flex flex-col items-center justify-center gap-3 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/30 p-8 hover:border-primary hover:bg-primary-container/20 transition-all group min-h-[160px]"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[24px] transition-colors">
                  add
                </span>
              </div>
              <span className="text-sm font-headline font-medium text-on-surface-variant group-hover:text-primary transition-colors">
                Generate New Resume
              </span>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
