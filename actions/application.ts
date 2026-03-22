"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest, extractData } from "@/lib/api";
import type { Application, ApplicationStats } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("socratic_session")?.value;
  if (!token) redirect("/login");
  return token;
}

export async function listApplications(page = 1): Promise<Application[]> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      `/api/v1/applications?page=${page}&size=20`,
      {},
      token
    );
    if (!res.ok) return [];
    const data = await extractData<Application[] | { content: Application[] }>(res);
    return Array.isArray(data) ? data : data.content ?? [];
  } catch {
    return [];
  }
}

export async function getApplicationStats(): Promise<ApplicationStats | null> {
  try {
    const token = await getToken();
    const res = await apiRequest("/api/v1/applications/stats", {}, token);
    if (!res.ok) return null;
    return await extractData<ApplicationStats>(res);
  } catch {
    return null;
  }
}

export async function updateApplicationStatus(
  id: string,
  status: Application["status"]
): Promise<{ error?: string } | void> {
  try {
    const token = await getToken();
    const res = await apiRequest(
      `/api/v1/applications/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      token
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || err.error || "Failed to update status." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update status." };
  }
}
