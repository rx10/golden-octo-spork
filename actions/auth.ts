"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

type AuthState = { error: string } | null;

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await fetch("https://api.socratic.pro/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || data.error || "Invalid credentials." };
    }

    const token = data.token || data.access_token;

    if (!token) {
      return { error: "Login failed: No token returned from server." };
    }

    await createSession(token);
  } catch (error) {
    return { error: "An error occurred during login. Please try again." };
  }

  redirect("/dashboard");
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  let hasToken = false;

  try {
    const res = await fetch("https://api.socratic.pro/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || data.error || "Signup failed." };
    }

    const token = data.token || data.access_token;
    if (token) {
      await createSession(token);
      hasToken = true;
    }
  } catch (error) {
    return { error: "An error occurred during signup. Please try again." };
  }

  // Redirects are OUTSIDE the try/catch because Next.js redirect() throws
  // a special error internally that would be swallowed by catch.
  if (hasToken) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
