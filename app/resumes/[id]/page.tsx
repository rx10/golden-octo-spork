import AppLayout from "@/components/AppLayout";
import { getResume, regenerateResume } from "@/actions/resume";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ResumeData } from "@/lib/types";
import DeleteResumeButton from "./DeleteResumeButton";

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-surface-container text-on-surface-variant",
  generated: "bg-primary-container text-primary",
  submitted: "bg-green-100 text-green-700",
  archived: "bg-surface-container text-outline",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ATSGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  const circumference = 2 * Math.PI * 36;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#e8eff3"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold font-headline text-on-surface">
            {score.toFixed(0)}
          </span>
        </div>
      </div>
      <p className="text-xs text-on-surface-variant font-body">ATS Score</p>
    </div>
  );
}

function ResumePreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-grey rounded-xl border border-outline-variant/20 p-8 font-body text-sm text-on-surface space-y-5">
      {/* Professional Summary */}
      {data.professional_summary && (
        <section>
          <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2 border-b border-outline-variant/20 pb-1">
            Professional Summary
          </h3>
          <p className="text-sm leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {data.work_experience && data.work_experience.length > 0 && (
        <section>
          <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-3 border-b border-outline-variant/20 pb-1">
            Experience
          </h3>
          <div className="space-y-4">
            {data.work_experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-headline font-semibold text-on-surface">
                      {exp.title}
                    </p>
                    <p className="text-on-surface-variant text-xs">{exp.company}</p>
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0">
                    {exp.start_date} — {exp.end_date}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-xs">
                        <span className="text-outline-variant mt-1 shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section>
          <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-3 border-b border-outline-variant/20 pb-1">
            Education
          </h3>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-headline font-semibold text-xs">{edu.school}</p>
                  <p className="text-on-surface-variant text-xs">
                    {edu.degree} in {edu.field}
                    {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section>
          <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2 border-b border-outline-variant/20 pb-1">
            Skills
          </h3>
          <div className="space-y-2">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div>
                <span className="text-xs text-on-surface-variant">Technical: </span>
                <span className="text-xs">{data.skills.technical.join(", ")}</span>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <span className="text-xs text-on-surface-variant">Soft skills: </span>
                <span className="text-xs">{data.skills.soft.join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2 border-b border-outline-variant/20 pb-1">
            Certifications
          </h3>
          <ul className="space-y-1">
            {data.certifications.map((cert, i) => (
              <li key={i} className="text-xs flex items-center gap-2">
                <span className="text-outline-variant">•</span>
                {cert}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResume(id);

  if (!resume) notFound();

  const statusColor =
    STATUS_COLOR[resume.status] ?? STATUS_COLOR.draft;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/resumes"
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            My Resumes
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main: resume preview */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold font-headline text-on-surface">
                  {resume.job_title ?? "Resume"}
                </h1>
                {resume.company_name && (
                  <p className="text-sm text-on-surface-variant font-body">
                    {resume.company_name}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor}`}
              >
                {resume.status}
              </span>
            </div>

            {resume.resume_data ? (
              <ResumePreview data={resume.resume_data} />
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-12 text-center">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">
                  hourglass_empty
                </span>
                <p className="mt-3 font-headline font-semibold text-on-surface">
                  Resume is being generated
                </p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Refresh in a moment to see your resume
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: actions + meta */}
          <div className="lg:w-64 shrink-0 space-y-4">
            {/* ATS Score */}
            {resume.ats_score !== undefined && resume.ats_score !== null && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 flex flex-col items-center">
                <ATSGauge score={resume.ats_score} />
                <p className="text-xs text-on-surface-variant text-center mt-3 font-body">
                  {resume.ats_score >= 80
                    ? "Excellent ATS compatibility"
                    : resume.ats_score >= 60
                    ? "Good — could be improved"
                    : "Needs improvement"}
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 space-y-3 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Template</span>
                <span className="text-on-surface capitalize">{resume.template_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Version</span>
                <span className="text-on-surface">v{resume.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Created</span>
                <span className="text-on-surface text-xs text-right">
                  {formatDate(resume.created_at)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={`/api/resumes/${resume.id}/pdf`}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download PDF
              </a>

              <form action={async () => { "use server"; await regenerateResume(id); }}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-surface-container text-on-surface py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  Regenerate
                </button>
              </form>

              <DeleteResumeButton id={id} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
