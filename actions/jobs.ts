"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest, extractData } from "@/lib/api";
import type { Job } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("socratic_session")?.value;
  if (!token) redirect("/login");
  return token;
}

export async function listJobs(params?: {
  title?: string;
  location?: string;
  page?: number;
}): Promise<Job[]> {
  try {
    const token = await getToken();
    const query = new URLSearchParams();
    if (params?.title) query.set("title", params.title);
    if (params?.location) query.set("location", params.location);
    if (params?.page) query.set("page", String(params.page));
    const path = `/api/jobs${query.toString() ? `?${query}` : ""}`;
    const res = await apiRequest(path, {}, token);
    if (!res.ok) return [];
    const data = await extractData<Job[] | { content: Job[] }>(res);
    return Array.isArray(data) ? data : data.content ?? [];
  } catch {
    return [];
  }
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    const token = await getToken();
    const res = await apiRequest(`/api/jobs/${id}`, {}, token);
    if (!res.ok) return null;
    return await extractData<Job>(res);
  } catch {
    return null;
  }
}
