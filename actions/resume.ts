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

export async function generateResume(
  jobTitle: string,
  companyName: string,
  jobDescriptionText: string,
  templateId: string = "classic"
): Promise<{ id?: string; error?: string }> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      "/api/v1/resumes",
      {
        method: "POST",
        body: JSON.stringify({
          job_title: jobTitle,
          company_name: companyName,
          job_description_text: jobDescriptionText,
          template_id: templateId,
        }),
      },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to generate resume." };
    }
    const data = await extractData<{ id: string; resume_id?: string }>(res);
    return { id: data.id || data.resume_id };
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
      return { error: err.message || err.error || "Failed to regenerate resume." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to regenerate resume." };
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
      return { error: err.message || err.error || "Failed to delete resume." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete resume." };
  }
  redirect("/resumes");
}
