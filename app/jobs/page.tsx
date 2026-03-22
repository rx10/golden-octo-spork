"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { listJobs } from "@/actions/jobs";
import type { Job } from "@/lib/types";

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-headline font-semibold text-on-surface text-base leading-tight truncate">
            {job.title}
          </h3>
          <p className="text-sm text-on-surface-variant font-body mt-0.5">
            {job.company_name ?? job.company}
          </p>
        </div>
        {job.source && (
          <span className="shrink-0 px-2 py-0.5 bg-surface-container text-on-surface-variant text-[11px] rounded-full font-body">
            {job.source}
          </span>
        )}
      </div>

      {job.location && (
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-body">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          {job.location}
        </div>
      )}

      {job.description && (
        <p className="text-xs text-on-surface-variant font-body line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/10">
        {job.posted_at ? (
          <span className="text-[11px] text-outline font-body">
            {new Date(job.posted_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface font-body transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              View
            </a>
          )}
          <Link
            href={`/resumes/new?job_id=${job.id}`}
            className="flex items-center gap-1.5 bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-headline font-semibold hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            Generate Resume
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isPending, startTransition] = useTransition();

  function fetchJobs(t: string, l: string) {
    startTransition(async () => {
      const results = await listJobs({
        title: t || undefined,
        location: l || undefined,
      });
      setJobs(results);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchJobs("", "");
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchJobs(title, location);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-on-surface-variant/50";

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-headline text-on-surface">Browse Jobs</h1>
            <p className="text-sm text-on-surface-variant font-body mt-1">
              Find opportunities and generate tailored resumes instantly
            </p>
          </div>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 mb-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <input
              type="text"
              className={inputClass}
              placeholder="Job title or keyword..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              className={inputClass}
              placeholder="Location (e.g. Remote, New York)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Search
          </button>
        </form>

        {/* Results */}
        {loading || isPending ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[40px] text-outline-variant animate-spin">
              progress_activity
            </span>
            <p className="text-sm text-on-surface-variant font-body">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">work_outline</span>
            <p className="mt-3 font-headline font-semibold text-on-surface">No jobs found</p>
            <p className="text-sm text-on-surface-variant font-body mt-1">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-on-surface-variant font-body mb-4">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
