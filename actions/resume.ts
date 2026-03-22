"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest, extractData } from "@/lib/api";
import type { Resume } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("socratic_session")?.value;
  if (!token) redirect("/login");
  return token;
}

export async function listResumes(): Promise<Resume[]> {
  try {
    const token = await getToken();
    const res = await apiRequest("/api/v1/resumes", {}, token);
    if (!res.ok) return [];
    const data = await extractData<Resume[] | { content: Resume[] }>(res);
    return Array.isArray(data) ? data : data.content ?? [];
  } catch {
    return [];
  }
}

export async function getResume(id: string): Promise<Resume | null> {
  try {
    const token = await getToken();
    const res = await apiRequest(`/api/v1/resumes/${id}`, {}, token);
    if (!res.ok) return null;
    return await extractData<Resume>(res);
  } catch {
    return null;
  }
}

/**
 * Creates a new resume linked to a job, then triggers AI generation.
 * Returns the new resume ID on success.
 */
export async function generateResume(
  jobId: string,
  templateId: string = "classic"
): Promise<{ id?: string; error?: string }> {
  try {
    const token = await getToken();

    // Step 1: create the resume record linked to job
    const createRes = await apiRequest(
      "/api/v1/resumes",
      {
        method: "POST",
        body: JSON.stringify({
          job_id: jobId,
          template_id: templateId,
          resume_data: null,
        }),
      },
      token
    );
    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to create resume." };
    }
    const created = await extractData<{ id: string; resume_id?: string }>(createRes);
    const resumeId = created.id || created.resume_id;
    if (!resumeId) return { error: "No resume ID returned." };

    // Step 2: trigger AI regeneration
    const regenRes = await apiRequest(
      `/api/v1/resumes/${resumeId}/regenerate`,
      { method: "POST" },
      token
    );
    if (!regenRes.ok) {
      // Resume was created but AI failed — still return the ID so user can retry
      return { id: resumeId, error: "Resume created but AI generation failed. You can regenerate from the resume page." };
    }

    return { id: resumeId };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to generate resume." };
  }
}

export async function regenerateResume(
  id: string
): Promise<{ error?: string } | void> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      `/api/v1/resumes/${id}/regenerate`,
      { method: "POST" },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to regenerate." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to regenerate." };
  }
  redirect(`/resumes/${id}`);
}

export async function deleteResume(id: string): Promise<{ error?: string } | void> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      `/api/v1/resumes/${id}`,
      { method: "DELETE" },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to delete." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete." };
  }
  redirect("/resumes");
}
