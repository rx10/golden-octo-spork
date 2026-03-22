"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest, extractData } from "@/lib/api";
import type { BillingStatus } from "@/lib/types";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("socratic_session")?.value;
  if (!token) redirect("/login");
  return token;
}

export async function getBillingStatus(): Promise<BillingStatus | null> {
  try {
    const token = await getToken();
    const res = await apiRequest("/api/billing/status", {}, token);
    if (!res.ok) return null;
    return await extractData<BillingStatus>(res);
  } catch {
    return null;
  }
}

export async function startCheckout(): Promise<void> {
  const token = await getToken();
  const res = await apiRequest(
    "/api/billing/checkout",
    { method: "POST" },
    token
  );
  if (!res.ok) return;
  const data = await extractData<{ checkout_url: string }>(res);
  redirect(data.checkout_url);
}

export async function openPortal(): Promise<void> {
  const token = await getToken();
  const res = await apiRequest(
    "/api/billing/portal",
    { method: "POST" },
    token
  );
  if (!res.ok) return;
  const data = await extractData<{ portal_url: string }>(res);
  redirect(data.portal_url);
}
