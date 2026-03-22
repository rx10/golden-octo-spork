"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest, extractData } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("socratic_session")?.value;
  if (!token) redirect("/login");
  return token;
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const token = await getToken();
    const res = await apiRequest("/api/v1/profile", {}, token);
    if (res.status === 404) return null;
    return await extractData<UserProfile>(res);
  } catch {
    return null;
  }
}

export async function updateProfile(
  data: Partial<UserProfile>
): Promise<{ error?: string } | void> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      "/api/v1/profile",
      { method: "PUT", body: JSON.stringify(data) },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to update profile." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update profile." };
  }
  redirect("/dashboard");
}

export async function updateSkills(
  skills: string[]
): Promise<{ error?: string } | void> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      "/api/v1/profile/skills",
      { method: "PATCH", body: JSON.stringify({ skills }) },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to update skills." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update skills." };
  }
}

export async function updatePreferences(prefs: {
  target_roles: string[];
  target_locations: string[];
  salary_min?: number;
  is_auto_apply: boolean;
}): Promise<{ error?: string } | void> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      "/api/v1/profile/preferences",
      { method: "PUT", body: JSON.stringify(prefs) },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to update preferences." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update preferences." };
  }
}
