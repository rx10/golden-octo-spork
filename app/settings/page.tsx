"use client";

import { useState, useEffect, useTransition } from "react";
import AppLayout from "@/components/AppLayout";
import { getProfile, updateProfile, updateSkills, updatePreferences } from "@/actions/profile";
import type { UserProfile } from "@/lib/types";

type Tab = "profile" | "preferences";

function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  return { profile, loading };
}

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-on-surface-variant/50";
const labelClass = "block text-sm font-medium text-on-surface-variant mb-1.5";

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-body z-50 ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {type === "success" ? "check_circle" : "error"}
      </span>
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const { profile, loading } = useProfile();
  const [tab, setTab] = useState<Tab>("profile");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile fields
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Skills
  const [skills, setSkills] = useState("");

  // Preferences
  const [targetRoles, setTargetRoles] = useState("");
  const [targetLocations, setTargetLocations] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [isAutoApply, setIsAutoApply] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setPhone(profile.phone ?? "");
    setLocation(profile.location ?? "");
    setLinkedinUrl(profile.linkedin_url ?? "");
    setPortfolioUrl(profile.portfolio_url ?? "");
    setSkills(profile.skills?.join(", ") ?? "");
    setTargetRoles(profile.target_roles?.join(", ") ?? "");
    setTargetLocations(profile.target_locations?.join(", ") ?? "");
    setSalaryMin(profile.salary_min?.toString() ?? "");
    setIsAutoApply(profile.is_auto_apply ?? false);
  }, [profile]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function parseCSV(value: string): string[] {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfile({
        phone,
        location,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        education: profile?.education ?? [],
        work_experience: profile?.work_experience ?? [],
        skills: parseCSV(skills),
        target_roles: parseCSV(targetRoles),
        target_locations: parseCSV(targetLocations),
        salary_min: salaryMin ? parseInt(salaryMin) : undefined,
        is_auto_apply: isAutoApply,
        certifications: profile?.certifications ?? [],
        projects: profile?.projects ?? [],
      });
      // updateProfile redirects on success; if we get here, it means no redirect (error)
      if (result && "error" in result) {
        showToast(result.error ?? "Failed to save.", "error");
      }
    });
  }

  function handleSaveSkills(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateSkills(parseCSV(skills));
      if (result && "error" in result) {
        showToast(result.error ?? "Failed to save skills.", "error");
      } else {
        showToast("Skills updated!", "success");
      }
    });
  }

  function handleSavePreferences(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updatePreferences({
        target_roles: parseCSV(targetRoles),
        target_locations: parseCSV(targetLocations),
        salary_min: salaryMin ? parseInt(salaryMin) : undefined,
        is_auto_apply: isAutoApply,
      });
      if (result && "error" in result) {
        showToast(result.error ?? "Failed to save.", "error");
      } else {
        showToast("Preferences saved!", "success");
      }
    });
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold font-headline text-on-surface mb-6">
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/20 mb-6 gap-4">
          {(["profile", "preferences"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-headline font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-on-surface"
              }`}
            >
              {t === "profile" ? "Profile Info" : "Job Preferences"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-[32px] text-outline-variant animate-spin">
              progress_activity
            </span>
            <p className="mt-2 text-sm text-on-surface-variant">Loading profile…</p>
          </div>
        ) : (
          <>
            {/* Profile tab */}
            {tab === "profile" && (
              <div className="space-y-6">
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-4"
                >
                  <h2 className="font-headline font-semibold text-on-surface">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        className={inputClass}
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="New York, NY"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn URL</label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://linkedin.com/in/yourname"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio / Website</label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://yourwebsite.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Saving…" : "Save Changes"}
                  </button>
                </form>

                <form
                  onSubmit={handleSaveSkills}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-4"
                >
                  <h2 className="font-headline font-semibold text-on-surface">Skills</h2>
                  <div>
                    <label className={labelClass}>
                      Your skills{" "}
                      <span className="font-normal text-on-surface-variant/60">
                        (comma-separated)
                      </span>
                    </label>
                    <textarea
                      className={`${inputClass} resize-none`}
                      rows={4}
                      placeholder="React, TypeScript, Python, SQL, AWS..."
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    {skills && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {skills
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-primary-container text-primary text-xs rounded-full font-body"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Saving…" : "Update Skills"}
                  </button>
                </form>
              </div>
            )}

            {/* Preferences tab */}
            {tab === "preferences" && (
              <form
                onSubmit={handleSavePreferences}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-4"
              >
                <h2 className="font-headline font-semibold text-on-surface">
                  Job Search Preferences
                </h2>
                <div>
                  <label className={labelClass}>
                    Target Job Titles{" "}
                    <span className="font-normal text-on-surface-variant/60">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Software Engineer, Senior Developer"
                    value={targetRoles}
                    onChange={(e) => setTargetRoles(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Preferred Locations{" "}
                    <span className="font-normal text-on-surface-variant/60">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="New York, Remote, San Francisco"
                    value={targetLocations}
                    onChange={(e) => setTargetLocations(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Minimum Salary (USD / year)</label>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="80000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-primary"
                    checked={isAutoApply}
                    onChange={(e) => setIsAutoApply(e.target.checked)}
                  />
                  <div>
                    <p className="text-sm font-medium text-on-surface font-body">
                      Auto-Apply
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Automatically submit applications for matched jobs
                    </p>
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60"
                >
                  {isPending ? "Saving…" : "Save Preferences"}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AppLayout>
  );
}
