"use client";

import { useState, useEffect, KeyboardEvent } from "react";

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
  source:      "LinkedIn" | "Dice" | string;
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

// ── job card ──────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  const days = daysSince(job.posted_date);

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
            <svg
              width="11" height="11" viewBox="0 0 16 16"
              fill="currentColor" className="me-1" aria-hidden="true"
            >
              <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
            {job.location}
          </span>
          {job.salary && (
            <span className="badge text-bg-success fw-normal">{job.salary}</span>
          )}
          <span className="badge text-bg-primary fw-normal">{job.source}</span>
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

// ── main page ─────────────────────────────────────────────────────────────────

export default function JobBoard() {
  const [jobs, setJobs]         = useState<Job[]>([]);
  const [loading, setLoading]   = useState<boolean>(false);
  const [scraping, setScraping] = useState<boolean>(false);
  const [role, setRole]         = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [sort, setSort]         = useState<SortOption>("recent");
  const [error, setError]       = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchJobs = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (role.trim())     params.set("title",    role.trim());
      if (location.trim()) params.set("location", location.trim());

      const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: Job[] = await res.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const triggerScrape = async (): Promise<void> => {
    setScraping(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role:     role.trim()     || "Software Developer",
          location: location.trim() || "California",
        }),
      });
      if (!res.ok) throw new Error(`Scrape failed: ${res.status}`);

      // Poll for completion then refresh
      pollScrapeStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setScraping(false);
    }
  };

  const pollScrapeStatus = (): void => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/scrape/status`);
        if (!res.ok) return;
        const status = await res.json();

        if (!status.running) {
          clearInterval(interval);
          setScraping(false);

          if (status.last_result?.error) {
            setError(`Scrape error: ${status.last_result.error}`);
          }

          await fetchJobs();
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);
  };

  useEffect(() => { fetchJobs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted: Job[] = [...jobs].sort((a, b) =>
    sort === "salary"
      ? parseSalaryMin(b.salary) - parseSalaryMin(a.salary)
      : daysSince(a.posted_date) - daysSince(b.posted_date)
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") fetchJobs();
  };

  const clearSearch = (): void => {
    setRole("");
    setLocation("");
    setJobs([]);
    setTimeout(fetchJobs, 0);
  };

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h1 className="fw-semibold fs-4 mb-1">Job board</h1>
        <p className="text-muted small mb-0">Search across LinkedIn and Dice</p>
      </div>

      {/* search */}
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
                onChange={(e) => setRole(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted mb-1">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. California"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="col-6 col-md-2">
              <button
                className="btn btn-dark w-100"
                onClick={fetchJobs}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
                    Searching…
                  </>
                ) : "Search"}
              </button>
            </div>
            <div className="col-6 col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearSearch}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">
            {loading ? "Loading…" : `${sorted.length} job${sorted.length !== 1 ? "s" : ""} found`}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={triggerScrape}
            disabled={scraping || loading}
          >
            {scraping ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
                Scraping…
              </>
            ) : "Refresh listings"}
          </button>
        </div>
        <select
          className="form-select form-select-sm w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort jobs"
        >
          <option value="recent">Most recent</option>
          <option value="salary">Salary (high to low)</option>
        </select>
      </div>

      {/* error */}
      {error && (
        <div className="alert alert-danger small py-2" role="alert">{error}</div>
      )}

      {/* empty state */}
      {!loading && !error && sorted.length === 0 && (
        <p className="text-muted small">
          No jobs found. Try different keywords or click &quot;Refresh listings&quot;.
        </p>
      )}

      {/* grid */}
      <div className="row row-cols-1 row-cols-md-2 g-3">
        {sorted.map((job) => (
          <div className="col" key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>

    </div>
  );
}