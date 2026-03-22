"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { generateResume } from "@/actions/resume";

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

export default function NewResumePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [templateId, setTemplateId] = useState("classic");

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-on-surface-variant/50";
  const labelClass = "block text-sm font-medium text-on-surface mb-1.5";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await generateResume(
        jobTitle,
        companyName,
        jobDescription,
        templateId
      );
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
          <h1 className="text-2xl font-bold font-headline text-on-surface">
            Generate Resume
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Paste a job description and our AI will tailor your resume to it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job info */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
            <h2 className="font-headline font-semibold text-on-surface mb-4">
              Job Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Job description */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
            <h2 className="font-headline font-semibold text-on-surface mb-1">
              Job Description
            </h2>
            <p className="text-xs text-on-surface-variant font-body mb-4">
              Paste the full job description. The AI uses this to tailor your resume.
            </p>
            <textarea
              className={`${inputClass} resize-none`}
              rows={12}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            <p className="text-xs text-on-surface-variant mt-2">
              {jobDescription.length} characters
            </p>
          </div>

          {/* Template selector */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
            <h2 className="font-headline font-semibold text-on-surface mb-4">
              Resume Template
            </h2>
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
                    <p className="text-sm font-headline font-semibold text-on-surface">
                      {t.name}
                    </p>
                    <p className="text-xs text-on-surface-variant font-body mt-0.5">
                      {t.description}
                    </p>
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
            disabled={isPending || !jobDescription.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-xl text-sm font-headline font-semibold hover:bg-primary-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
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
              AI is tailoring your resume — this takes 5-15 seconds
            </p>
          )}
        </form>
      </div>
    </AppLayout>
  );
}
