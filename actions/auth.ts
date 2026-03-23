"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const API = "https://api.socratic.pro";

type AuthState = { error: string } | null;

const ALLOWED_DOMAIN = "socratic.pro";

function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

export async function signup(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (!isAllowedEmail(email)) {
    return { error: `Registration is restricted to @${ALLOWED_DOMAIN} email addresses.` };
  }

  try {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || data.error || "Registration failed." };
    }

    const token = data.access_token || data.token;
    if (!token) return { error: "Registration failed: no token returned." };

    await createSession(token);
  } catch {
    return { error: "An error occurred. Please try again." };
  }

  redirect("/onboarding");
}

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || data.error || "Invalid credentials." };
    }

    const token = data.access_token || data.token;
    if (!token) return { error: "Login failed: no token returned." };

    await createSession(token);
  } catch {
    return { error: "An error occurred. Please try again." };
  }

  redirect("/dashboard");
}

export async function requestOTP(
  email: string
): Promise<{ error?: string } | null> {
  try {
    const res = await fetch(`${API}/api/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || data.error || "Failed to send OTP." };
    }
    return null;
  } catch {
    return { error: "Failed to send OTP. Please try again." };
  }
}

export async function verifyOTP(
  email: string,
  code: string
): Promise<{ error?: string } | void> {
  try {
    const res = await fetch(`${API}/api/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || data.error || "Invalid or expired code." };
    }
    const token = data.access_token || data.token;
    if (!token) return { error: "Verification failed: no token returned." };
    await createSession(token);
  } catch {
    return { error: "Verification failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function googleAuth(
  idToken: string
): Promise<{ error?: string } | void> {
  try {
    const res = await fetch(`${API}/api/auth/oauth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || data.error || "Google sign-in failed." };
    }
    const token = data.access_token || data.token;
    if (!token) return { error: "Google sign-in failed: no token returned." };
    await createSession(token);
  } catch {
    return { error: "Google sign-in failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
