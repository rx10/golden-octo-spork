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
 * Generates a resume by sending the user's profile + raw job description
 * to the backend in a single request. The backend calls Claude, stores the
 * result, and returns the created resume.
 */
export async function generateResume(
  jobDescription: string,
  templateId: string = "classic"
): Promise<{ id?: string; error?: string }> {
  try {
    const token = await getToken();

    // Fetch user profile to send inline
    const profileRes = await apiRequest("/api/v1/profile", {}, token);
    if (!profileRes.ok) {
      return { error: "Could not load your profile. Please complete your profile first." };
    }
    const profile = await extractData<{
      phone?: string;
      location?: string;
      linkedin_url?: string;
      portfolio_url?: string;
      work_experience: { company: string; title: string; start_date: string; end_date: string; bullets: string[] }[];
      education: { school: string; degree: string; field: string; grad_year: string }[];
      skills: string[];
      certifications: string[];
    }>(profileRes);

    const body = {
      profile: {
        personal: {
          email: "",
          phone: profile.phone ?? "",
          location: profile.location ?? "",
          linkedin_url: profile.linkedin_url ?? "",
          portfolio_url: profile.portfolio_url ?? "",
        },
        work_experience: (profile.work_experience ?? []).map((exp) => ({
          company: exp.company,
          title: exp.title,
          start_date: exp.start_date,
          end_date: exp.end_date,
          bullets: exp.bullets,
        })),
        education: (profile.education ?? []).map((edu) => ({
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          year: edu.grad_year,
        })),
        skills: profile.skills ?? [],
        certifications: profile.certifications ?? [],
      },
      job_description: jobDescription,
      template_id: templateId,
    };

    const res = await apiRequest(
      "/api/v1/resumes/generate",
      { method: "POST", body: JSON.stringify(body) },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to generate resume." };
    }
    const resume = await extractData<{ id: string }>(res);
    return { id: resume.id };
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
