"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AppLayout from "@/components/AppLayout";
import { generateResume } from "@/actions/resume";
import { listJobs, getJob } from "@/actions/jobs";
import type { Job } from "@/lib/types";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Single column, traditional. Best ATS compatibility.",
    icon: "article",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif with subtle accents.",
    icon: "deployed_code",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense layout for 10+ years of experience.",
    icon: "compress",
  },
];

function NewResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedJobId = searchParams.get("job_id") ?? "";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [templateId, setTemplateId] = useState("classic");

  // Job selection state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [jobResults, setJobResults] = useState<Job[]>([]);
  const [jobSearchLoading, setJobSearchLoading] = useState(false);
  const [showJobDropdown, setShowJobDropdown] = useState(false);

  // Job description text
  const [jdText, setJdText] = useState("");

  // Load preselected job on mount
  useEffect(() => {
    if (!preselectedJobId) return;
    getJob(preselectedJobId).then((job) => {
      if (job) {
        setSelectedJob(job);
        if (job.description) setJdText(job.description);
      }
    });
  }, [preselectedJobId]);

  // Search jobs as user types
  useEffect(() => {
    if (!jobSearchQuery.trim() || selectedJob) return;
    const timer = setTimeout(async () => {
      setJobSearchLoading(true);
      const results = await listJobs({ title: jobSearchQuery });
      setJobResults(results);
      setJobSearchLoading(false);
      setShowJobDropdown(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [jobSearchQuery, selectedJob]);

  function handleSelectJob(job: Job) {
    setSelectedJob(job);
    setShowJobDropdown(false);
    setJobSearchQuery("");
    if (job.description) setJdText(job.description);
  }

  function handleClearJob() {
    setSelectedJob(null);
    setJobSearchQuery("");
    setJobResults([]);
    setJdText("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jdText.trim()) {
      setError("Please paste a job description.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await generateResume(jdText.trim(), templateId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.id) {
        router.push(`/resumes/${result.id}`);
      } else {
        router.push("/resumes");
      }
    });
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-on-surface-variant/50";
  const labelClass = "block text-sm font-medium text-on-surface mb-1.5";

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface mb-4 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </button>
          <h1 className="text-2xl font-bold font-headline text-on-surface">Generate Resume</h1>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Paste a job description and our AI will tailor your resume to it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job search (optional — pre-fills description) */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
            <h2 className="font-headline font-semibold text-on-surface mb-1">Job</h2>
            <p className="text-xs text-on-surface-variant font-body mb-4">
              Search to auto-fill the description below, or skip and paste it manually.
            </p>

            {selectedJob ? (
              <div className="flex items-start justify-between gap-3 p-4 bg-primary-container/20 border border-primary/20 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-semibold text-on-surface text-sm">
                    {selectedJob.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {selectedJob.company_name ?? selectedJob.company}
                    {selectedJob.location ? ` · ${selectedJob.location}` : ""}
                  </p>
                  {!selectedJob.description && (
                    <p className="text-xs text-amber-600 mt-1">
                      No description available — paste one below.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClearJob}
                  className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <label className={labelClass}>Search for a job</label>
                <div className="relative">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Search by job title..."
                    value={jobSearchQuery}
                    onChange={(e) => {
                      setJobSearchQuery(e.target.value);
                      if (!e.target.value.trim()) {
                        setShowJobDropdown(false);
                        setJobResults([]);
                      }
                    }}
                    onFocus={() => jobResults.length > 0 && setShowJobDropdown(true)}
                  />
                  {jobSearchLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant animate-spin">
                      progress_activity
                    </span>
                  )}
                </div>

                {showJobDropdown && jobResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden">
                    {jobResults.slice(0, 6).map((job) => (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => handleSelectJob(job)}
                        className="w-full text-left px-4 py-3 hover:bg-surface-container/60 transition-colors border-b border-outline-variant/10 last:border-0"
                      >
                        <p className="text-sm font-body font-medium text-on-surface">{job.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {job.company_name ?? job.company}
                          {job.location ? ` · ${job.location}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {showJobDropdown && !jobSearchLoading && jobResults.length === 0 && jobSearchQuery.trim() && (
                  <div className="mt-2 text-center py-4 text-sm text-on-surface-variant font-body">
                    No jobs found. Try a different search.
                  </div>
                )}

                <p className="mt-2 text-xs text-on-surface-variant font-body">
                  Or{" "}
                  <a href="/jobs" className="text-primary hover:underline font-medium">
                    browse all jobs
                  </a>{" "}
                  to find one first.
                </p>
              </div>
            )}
          </div>

          {/* Job description textarea */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
            <label className="font-headline font-semibold text-on-surface block mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-on-surface-variant font-body mb-3">
              Paste the full job description. The AI uses this to tailor every bullet point and skill.
            </p>
            <textarea
              className={`${inputClass} min-h-[200px] resize-y`}
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            {jdText.trim().length > 0 && (
              <p className="text-xs text-on-surface-variant mt-1.5">
                {jdText.trim().length} characters
              </p>
            )}
          </div>

          {/* Template selector */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
            <h2 className="font-headline font-semibold text-on-surface mb-4">Resume Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                    templateId === t.id
                      ? "border-primary bg-primary-container/30"
                      : "border-outline-variant/30 hover:border-outline-variant"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      templateId === t.id ? "bg-primary" : "bg-surface-container"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        templateId === t.id ? "text-on-primary" : "text-on-surface-variant"
                      }`}
                    >
                      {t.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-headline font-semibold text-on-surface">{t.name}</p>
                    <p className="text-xs text-on-surface-variant font-body mt-0.5">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !jdText.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Generating your resume...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                Generate Resume
              </>
            )}
          </button>

          {isPending && (
            <p className="text-center text-xs text-on-surface-variant font-body">
              AI is tailoring your resume — this takes 5–15 seconds
            </p>
          )}
        </form>
      </div>
    </AppLayout>
  );
}

export default function NewResumePage() {
  return (
    <Suspense fallback={null}>
      <NewResumeContent />
    </Suspense>
  );
}
