"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/profile";
import type { Education, WorkExperience } from "@/lib/types";

type OnboardingData = {
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  education: Education[];
  work_experience: WorkExperience[];
  skills: string;
  target_roles: string;
  target_locations: string;
  salary_min: string;
  is_auto_apply: boolean;
};

const EMPTY_EDUCATION: Education = {
  school: "",
  degree: "",
  field: "",
  grad_year: "",
  gpa: "",
};

const EMPTY_EXPERIENCE: WorkExperience = {
  company: "",
  title: "",
  start_date: "",
  end_date: "",
  bullets: [""],
};

const STEPS = [
  { label: "Personal Info", icon: "person" },
  { label: "Education", icon: "school" },
  { label: "Experience", icon: "work" },
  { label: "Skills & Goals", icon: "star" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<OnboardingData>({
    phone: "",
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    education: [{ ...EMPTY_EDUCATION }],
    work_experience: [{ ...EMPTY_EXPERIENCE }],
    skills: "",
    target_roles: "",
    target_locations: "",
    salary_min: "",
    is_auto_apply: false,
  });

  function updateField<K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  // Education helpers
  function updateEdu(index: number, field: keyof Education, value: string) {
    setData((prev) => {
      const education = [...prev.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  }

  function addEdu() {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { ...EMPTY_EDUCATION }],
    }));
  }

  function removeEdu(index: number) {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }

  // Experience helpers
  function updateExp(
    index: number,
    field: keyof WorkExperience,
    value: string | string[]
  ) {
    setData((prev) => {
      const work_experience = [...prev.work_experience];
      work_experience[index] = {
        ...work_experience[index],
        [field]: value,
      } as WorkExperience;
      return { ...prev, work_experience };
    });
  }

  function updateBullet(expIndex: number, bulletIndex: number, value: string) {
    setData((prev) => {
      const work_experience = [...prev.work_experience];
      const bullets = [...work_experience[expIndex].bullets];
      bullets[bulletIndex] = value;
      work_experience[expIndex] = { ...work_experience[expIndex], bullets };
      return { ...prev, work_experience };
    });
  }

  function addBullet(expIndex: number) {
    setData((prev) => {
      const work_experience = [...prev.work_experience];
      work_experience[expIndex] = {
        ...work_experience[expIndex],
        bullets: [...work_experience[expIndex].bullets, ""],
      };
      return { ...prev, work_experience };
    });
  }

  function removeBullet(expIndex: number, bulletIndex: number) {
    setData((prev) => {
      const work_experience = [...prev.work_experience];
      const bullets = work_experience[expIndex].bullets.filter(
        (_, i) => i !== bulletIndex
      );
      work_experience[expIndex] = { ...work_experience[expIndex], bullets };
      return { ...prev, work_experience };
    });
  }

  function addExp() {
    setData((prev) => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        { ...EMPTY_EXPERIENCE, bullets: [""] },
      ],
    }));
  }

  function removeExp(index: number) {
    setData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }));
  }

  function parseCSV(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleComplete() {
    setError("");
    startTransition(async () => {
      const result = await updateProfile({
        phone: data.phone,
        location: data.location,
        linkedin_url: data.linkedin_url,
        portfolio_url: data.portfolio_url,
        education: data.education.filter((e) => e.school),
        work_experience: data.work_experience
          .filter((e) => e.company)
          .map((e) => ({
            ...e,
            bullets: e.bullets.filter(Boolean),
          })),
        skills: parseCSV(data.skills),
        target_roles: parseCSV(data.target_roles),
        target_locations: parseCSV(data.target_locations),
        salary_min: data.salary_min ? parseInt(data.salary_min) : undefined,
        is_auto_apply: data.is_auto_apply,
        certifications: [],
        projects: [],
      });
      if (result && "error" in result && result.error) {
        setError(result.error);
      }
      // updateProfile redirects to /dashboard on success
    });
  }

  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-on-surface-variant/50";
  const labelClass = "block text-xs font-medium text-on-surface-variant mb-1.5";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-lowest">
        <span className="font-headline font-bold text-primary text-xl tracking-tight">
          Socratic<span className="text-on-surface">.pro</span>
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-headline font-bold transition-colors ${
                      i < step
                        ? "bg-primary text-on-primary"
                        : i === step
                        ? "bg-primary text-on-primary ring-4 ring-primary/20"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {i < step ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-xs font-body hidden sm:block ${
                      i === step ? "text-primary font-medium" : "text-on-surface-variant"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {STEPS[step].icon}
                </span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-body">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h2 className="text-lg font-bold font-headline text-on-surface">
                  {STEPS[step].label}
                </h2>
              </div>
            </div>

            {/* Step 1: Personal Info */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+1 (555) 000-0000"
                      value={data.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="New York, NY"
                      value={data.location}
                      onChange={(e) => updateField("location", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    type="url"
                    className={inputClass}
                    placeholder="https://linkedin.com/in/yourname"
                    value={data.linkedin_url}
                    onChange={(e) => updateField("linkedin_url", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Portfolio / Website</label>
                  <input
                    type="url"
                    className={inputClass}
                    placeholder="https://yourwebsite.com"
                    value={data.portfolio_url}
                    onChange={(e) => updateField("portfolio_url", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 1 && (
              <div className="space-y-6">
                {data.education.map((edu, i) => (
                  <div
                    key={i}
                    className="border border-outline-variant/20 rounded-xl p-4 space-y-3 relative"
                  >
                    {data.education.length > 1 && (
                      <button
                        onClick={() => removeEdu(i)}
                        className="absolute top-3 right-3 text-on-surface-variant hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    )}
                    <div>
                      <label className={labelClass}>School / University</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="MIT"
                        value={edu.school}
                        onChange={(e) => updateEdu(i, "school", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Degree</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => updateEdu(i, "degree", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Field of Study</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Computer Science"
                          value={edu.field}
                          onChange={(e) => updateEdu(i, "field", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Graduation Year</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="2022"
                          value={edu.grad_year}
                          onChange={(e) => updateEdu(i, "grad_year", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>GPA (optional)</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="3.8"
                          value={edu.gpa}
                          onChange={(e) => updateEdu(i, "gpa", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEdu}
                  className="w-full py-2.5 border-2 border-dashed border-outline-variant/40 rounded-xl text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Another Education
                </button>
              </div>
            )}

            {/* Step 3: Work Experience */}
            {step === 2 && (
              <div className="space-y-6">
                {data.work_experience.map((exp, i) => (
                  <div
                    key={i}
                    className="border border-outline-variant/20 rounded-xl p-4 space-y-3 relative"
                  >
                    {data.work_experience.length > 1 && (
                      <button
                        onClick={() => removeExp(i)}
                        className="absolute top-3 right-3 text-on-surface-variant hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Company</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Acme Corp"
                          value={exp.company}
                          onChange={(e) => updateExp(i, "company", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Job Title</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Software Engineer"
                          value={exp.title}
                          onChange={(e) => updateExp(i, "title", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Start Date</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Jan 2021"
                          value={exp.start_date}
                          onChange={(e) => updateExp(i, "start_date", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>End Date</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Present"
                          value={exp.end_date}
                          onChange={(e) => updateExp(i, "end_date", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Key Achievements</label>
                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-outline-variant mt-2">
                              arrow_right
                            </span>
                            <input
                              type="text"
                              className={`${inputClass} flex-1`}
                              placeholder="Increased revenue by 20% by..."
                              value={bullet}
                              onChange={(e) => updateBullet(i, bi, e.target.value)}
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                onClick={() => removeBullet(i, bi)}
                                className="text-on-surface-variant hover:text-red-500 transition-colors mt-2"
                              >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addBullet(i)}
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                          Add bullet
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExp}
                  className="w-full py-2.5 border-2 border-dashed border-outline-variant/40 rounded-xl text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Another Role
                </button>
              </div>
            )}

            {/* Step 4: Skills & Preferences */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Skills{" "}
                    <span className="text-on-surface-variant/60 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="React, TypeScript, Node.js, SQL, Python..."
                    value={data.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Target Job Titles{" "}
                    <span className="text-on-surface-variant/60 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Software Engineer, Senior Developer, Tech Lead"
                    value={data.target_roles}
                    onChange={(e) => updateField("target_roles", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Preferred Locations{" "}
                    <span className="text-on-surface-variant/60 font-normal">
                      (comma-separated, or &quot;Remote&quot;)
                    </span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="New York, Remote, San Francisco"
                    value={data.target_locations}
                    onChange={(e) => updateField("target_locations", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Minimum Salary (USD / year)</label>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="80000"
                    value={data.salary_min}
                    onChange={(e) => updateField("salary_min", e.target.value)}
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-primary"
                    checked={data.is_auto_apply}
                    onChange={(e) => updateField("is_auto_apply", e.target.checked)}
                  />
                  <div>
                    <p className="text-sm font-medium text-on-surface font-body">
                      Enable Auto-Apply
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Automatically submit applications for matched jobs
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-headline font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors"
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Skip link */}
          <p className="text-center text-xs text-on-surface-variant mt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:underline"
            >
              Skip for now — I&apos;ll complete my profile later
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
