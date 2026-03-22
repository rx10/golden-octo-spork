"use client";

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";
import Link from "next/link";
import { logout } from "@/actions/auth";

// ── types ─────────────────────────────────────────────────────────────────────

interface Job {
  id:          string;
  title:       string;
  company:     string;
  location:    string;
  posted_date: string | null;
  description: string | null;
  salary:      string | null;
  url:         string;
  source:      "LinkedIn" | "Dice" | "Indeed" | "ZipRecruiter" | "RemoteOK" | string;
  scraped_at:  string;
}

type SortOption = "recent" | "salary";

// ── helpers ───────────────────────────────────────────────────────────────────

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0;
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function postedLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function truncate(str: string | null, len = 200): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

function parseSalaryMin(salary: string | null): number {
  if (!salary) return 0;
  const match = salary.match(/\d[\d,]*/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
}

const HYBRID_TERMS = ["hybrid", "on-site", "onsite", "in-office", "in office", "in-person", "in person"];

function isHybrid(location: string): boolean {
  const loc = location.toLowerCase();
  return HYBRID_TERMS.some(t => loc.includes(t));
}

function locationMatches(jobLocation: string, searchedLocation: string): boolean {
  if (!searchedLocation.trim()) return true;
  return jobLocation.toLowerCase().includes(searchedLocation.trim().toLowerCase());
}

function displayLocation(job: Job, searchedLocation: string): string {
  if (!searchedLocation.trim()) return job.location;
  if (locationMatches(job.location, searchedLocation)) return job.location;
  return "Remote";
}

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn:     "bg-blue-500/15 text-blue-600",
  Dice:         "bg-cyan-500/15 text-cyan-600",
  Indeed:       "bg-amber-500/15 text-amber-700",
  ZipRecruiter: "bg-red-500/15 text-red-600",
  RemoteOK:     "bg-emerald-500/15 text-emerald-600",
};

// ── job card ──────────────────────────────────────────────────────────────────

function JobCard({ job, searchedLocation }: { job: Job; searchedLocation: string }) {
  const days = daysSince(job.posted_date);
  const locLabel = displayLocation(job, searchedLocation);
  const badgeColor = SOURCE_COLORS[job.source] ?? "bg-surface-container-high text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="font-headline text-base font-bold text-on-surface truncate">{job.title}</h3>
            <p className="text-on-surface-variant text-sm">{job.company}</p>
          </div>
          <span className="text-outline text-xs whitespace-nowrap pt-0.5">
            {postedLabel(days)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>location_on</span>
            {locLabel}
          </span>
          {job.salary && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-medium">
              {job.salary}
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            {job.source}
          </span>
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {truncate(job.description)}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-outline-variant/10">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View on {job.source}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
          </a>
        </div>

      </div>
    </div>
  );
}

// ── scrape progress ───────────────────────────────────────────────────────────

function ProgressBar({ count, scraping }: { count: number; scraping: boolean }) {
  if (!scraping && count === 0) return null;
  return (
    <div className="flex items-center gap-2">
      {scraping && (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
      <span className="text-on-surface-variant text-sm">
        {scraping
          ? `Found ${count} job${count !== 1 ? "s" : ""} so far — more loading…`
          : `${count} job${count !== 1 ? "s" : ""} found`}
      </span>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [jobs, setJobs]                         = useState<Job[]>([]);
  const [scraping, setScraping]                 = useState<boolean>(false);
  const [initialLoading, setInitialLoading]     = useState<boolean>(true);
  const [role, setRole]                         = useState<string>("");
  const [location, setLocation]                 = useState<string>("");
  const [searchedLocation, setSearchedLocation] = useState<string>("");
  const [sort, setSort]                         = useState<SortOption>("recent");
  const [error, setError]                       = useState<string | null>(null);
  const pollRef                                 = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenIdsRef                              = useRef<Set<string>>(new Set());

  const API_BASE = "https://api.socratic.pro";

  const mergeJobs = useCallback((incoming: Job[]) => {
    const fresh = incoming.filter(j => !seenIdsRef.current.has(j.id));
    if (fresh.length === 0) return;
    fresh.forEach(j => seenIdsRef.current.add(j.id));
    setJobs(prev => [...prev, ...fresh]);
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);
        if (res.ok) mergeJobs(await res.json());
      } catch { /* ignore */ }
      finally { setInitialLoading(false); }
    })();
    return stopPolling;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (): Promise<void> => {
    stopPolling();
    setScraping(true);
    setError(null);

    seenIdsRef.current = new Set();
    setJobs([]);

    const submittedLocation = location.trim() || "California";
    setSearchedLocation(submittedLocation);

    try {
      const res = await fetch(`${API_BASE}/api/scrape/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role:     role.trim() || "Software Developer",
          location: submittedLocation,
        }),
      });
      if (!res.ok) throw new Error(`Scrape failed: ${res.status}`);

      pollRef.current = setInterval(async () => {
        try {
          const jobsRes = await fetch(`${API_BASE}/api/jobs`);
          if (jobsRes.ok) mergeJobs(await jobsRes.json());

          const statusRes = await fetch(`${API_BASE}/api/scrape/status`);
          if (!statusRes.ok) return;
          const status = await statusRes.json();

          if (!status.running) {
            stopPolling();
            if (status.last_result?.error) {
              setError(`Scrape error: ${status.last_result.error}`);
            }
            const finalRes = await fetch(`${API_BASE}/api/jobs`);
            if (finalRes.ok) mergeJobs(await finalRes.json());
            setScraping(false);
          }
        } catch { /* ignore transient poll errors */ }
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setScraping(false);
    }
  };

  const sorted: Job[] = [...jobs].sort((a, b) =>
    sort === "salary"
      ? parseSalaryMin(b.salary) - parseSalaryMin(a.salary)
      : daysSince(a.posted_date) - daysSince(b.posted_date)
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSearch();
  };

  const busy = initialLoading || scraping;

  return (
    <div className="min-h-screen bg-surface">

      {/* Full-screen loader — first load only */}
      {initialLoading && (
        <div className="fixed inset-0 bg-surface/85 z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-on-surface-variant font-medium">Loading…</span>
        </div>
      )}

      {/* ── Top bar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold tracking-tighter text-on-background">
            Socratic.pro
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Job Board</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Search across LinkedIn, Dice, Indeed, ZipRecruiter &amp; RemoteOK
          </p>
        </div>

        {/* ── Search card ──────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Role
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={role}
                onChange={e => setRole(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={scraping}
                className="w-full bg-surface-container-low rounded-md px-4 py-3 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none disabled:opacity-50"
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={scraping}
                className="w-full bg-surface-container-low rounded-md px-4 py-3 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none disabled:opacity-50"
              />
            </div>
            <div className="md:col-span-3">
              <button
                onClick={handleSearch}
                disabled={busy}
                className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold py-3 rounded-md shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {scraping ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    Searching…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Toolbar ──────────────────────────────── */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <ProgressBar count={sorted.length} scraping={scraping} />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            aria-label="Sort jobs"
            className="ml-auto bg-surface-container-low text-on-surface text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
          >
            <option value="recent">Most recent</option>
            <option value="salary">Salary (high → low)</option>
          </select>
        </div>

        {/* ── Error ────────────────────────────────── */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* ── Empty state ──────────────────────────── */}
        {!busy && !error && sorted.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-outline mb-4 block">work_outline</span>
            <p className="text-on-surface-variant">No jobs found. Try different keywords and search again.</p>
          </div>
        )}

        {/* ── Job grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map(job => (
            <JobCard key={job.id} job={job} searchedLocation={searchedLocation} />
          ))}
        </div>

      </div>
    </div>
  );
}
