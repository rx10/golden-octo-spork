"use client";

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";

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

/** Returns the display label for a job's location badge. */
function displayLocation(job: Job, searchedLocation: string): string {
  if (!searchedLocation.trim()) return job.location;
  if (locationMatches(job.location, searchedLocation)) return job.location;
  // job came from remote pass — show "Remote" not its raw location
  return "Remote";
}

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn:     "text-bg-primary",
  Dice:         "text-bg-info",
  Indeed:       "text-bg-warning",
  ZipRecruiter: "text-bg-danger",
  RemoteOK:     "text-bg-success",
};

// ── job card ──────────────────────────────────────────────────────────────────

function JobCard({ job, searchedLocation }: { job: Job; searchedLocation: string }) {
  const days    = daysSince(job.posted_date);
  const locLabel = displayLocation(job, searchedLocation);
  const badgeColor = SOURCE_COLORS[job.source] ?? "text-bg-secondary";

  return (
    <div className="card border shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-2">

        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <h5 className="card-title mb-0 fw-semibold fs-6">{job.title}</h5>
            <p className="text-muted small mb-0">{job.company}</p>
          </div>
          <span className="text-muted text-nowrap" style={{ fontSize: 12 }}>
            {postedLabel(days)}
          </span>
        </div>

        <div className="d-flex flex-wrap gap-1">
          <span className="badge text-bg-secondary fw-normal">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="me-1" aria-hidden="true">
              <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
            </svg>
            {locLabel}
          </span>
          {job.salary && (
            <span className="badge text-bg-success fw-normal">{job.salary}</span>
          )}
          <span className={`badge fw-normal ${badgeColor}`}>{job.source}</span>
        </div>

        {job.description && (
          <p className="card-text text-muted small mb-0" style={{ lineHeight: 1.55 }}>
            {truncate(job.description)}
          </p>
        )}

        <div className="mt-auto pt-2 border-top">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            View on {job.source} →
          </a>
        </div>

      </div>
    </div>
  );
}

// ── scrape progress bar ───────────────────────────────────────────────────────

function ProgressBar({ count, scraping }: { count: number; scraping: boolean }) {
  if (!scraping && count === 0) return null;
  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      {scraping && (
        <div className="spinner-grow spinner-grow-sm text-primary flex-shrink-0" role="status">
          <span className="visually-hidden">Scraping…</span>
        </div>
      )}
      <span className="text-muted small">
        {scraping
          ? `Found ${count} job${count !== 1 ? "s" : ""} so far — more loading…`
          : `${count} job${count !== 1 ? "s" : ""} found`}
      </span>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function JobBoard() {
  const [jobs, setJobs]                     = useState<Job[]>([]);
  const [scraping, setScraping]             = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [role, setRole]                     = useState<string>("");
  const [location, setLocation]             = useState<string>("");
  const [searchedLocation, setSearchedLocation] = useState<string>("");
  const [sort, setSort]                     = useState<SortOption>("recent");
  const [error, setError]                   = useState<string | null>(null);
  const pollRef                             = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenIdsRef                          = useRef<Set<string>>(new Set());

  const API_BASE = "https://rx10-jobboard.duckdns.org";

  /** Merge new jobs into state, deduplicating by id. */
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

  // Initial load — show whatever is already in DB
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs?limit=500`);
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

    // Clear previous results
    seenIdsRef.current = new Set();
    setJobs([]);

    const submittedLocation = location.trim() || "California";
    setSearchedLocation(submittedLocation);

    try {
      const res = await fetch(`${API_BASE}/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role:     role.trim() || "Software Developer",
          location: submittedLocation,
        }),
      });
      if (!res.ok) throw new Error(`Scrape failed: ${res.status}`);

      // Poll every 2 s — fetch partial results each tick for progressive loading
      pollRef.current = setInterval(async () => {
        try {
          // Fetch whatever is in DB right now (incremental)
          const jobsRes = await fetch(`${API_BASE}/api/jobs?limit=500`);
          if (jobsRes.ok) mergeJobs(await jobsRes.json());

          // Check if scrape is still running
          const statusRes = await fetch(`${API_BASE}/api/scrape/status`);
          if (!statusRes.ok) return;
          const status = await statusRes.json();

          if (!status.running) {
            stopPolling();
            if (status.last_result?.error) {
              setError(`Scrape error: ${status.last_result.error}`);
            }
            // Final fetch to make sure we have everything
            const finalRes = await fetch(`${API_BASE}/api/jobs?limit=500`);
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
    <div className="container py-4">

      {/* Full-screen overlay — only on very first load */}
      {initialLoading && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(255,255,255,0.85)",
          zIndex: 1050,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <span className="fw-medium text-muted">Loading…</span>
        </div>
      )}

      <div className="mb-4">
        <h1 className="fw-semibold fs-4 mb-1">Job board</h1>
        <p className="text-muted small mb-0">Search across LinkedIn, Dice, Indeed, ZipRecruiter & RemoteOK</p>
      </div>

      {/* Search bar */}
      <div className="card border shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label small text-muted mb-1">Role</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Software Engineer"
                value={role}
                onChange={e => setRole(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={scraping}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted mb-1">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Hyderabad"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={scraping}
              />
            </div>
            <div className="col-12 col-md-3">
              <button
                className="btn btn-dark w-100"
                onClick={handleSearch}
                disabled={busy}
              >
                {scraping ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"/>
                    Searching…
                  </>
                ) : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <ProgressBar count={sorted.length} scraping={scraping} />
        <select
          className="form-select form-select-sm w-auto ms-auto"
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          aria-label="Sort jobs"
        >
          <option value="recent">Most recent</option>
          <option value="salary">Salary (high to low)</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger small py-2" role="alert">{error}</div>
      )}

      {/* Empty state */}
      {!busy && !error && sorted.length === 0 && (
        <p className="text-muted small">No jobs found. Try different keywords and search again.</p>
      )}

      {/* Job grid — no limit, shows all */}
      <div className="row row-cols-1 row-cols-md-2 g-3">
        {sorted.map(job => (
          <div className="col" key={job.id}>
            <JobCard job={job} searchedLocation={searchedLocation} />
          </div>
        ))}
      </div>

    </div>
  );
}