"use client";

import Link from "next/link";
import { useActionState, useState, useEffect, useTransition } from "react";
import { signup, googleAuth } from "@/actions/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string; width: number }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function GoogleButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          setError("");
          startTransition(async () => {
            const result = await googleAuth(response.credential);
            if (result && "error" in result && result.error) {
              setError(result.error);
            }
          });
        },
      });
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [clientId]);

  function handleClick() {
    if (!clientId) return;
    window.google?.accounts.id.prompt();
  }

  return (
    <>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-container-high dark:border-outline/50"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase font-label tracking-widest">
          <span className="bg-surface dark:bg-neutral-surface px-4 text-outline dark:text-on-surface-variant">or continue with</span>
        </div>
      </div>

      {error && <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md mb-2">{error}</div>}

      {isPending ? (
        <div className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm text-outline font-body">
          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          Signing up...
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-surface-container-high dark:border-outline bg-white dark:bg-surface-container hover:bg-surface-container-low dark:hover:bg-slate-700 text-on-surface font-headline font-bold rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm">Sign up with Google</span>
        </button>
      )}
    </>
  );
}

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup, null);

  const inputClass = "w-full px-4 py-3 text-sm bg-surface-container-low dark:bg-surface-container border border-transparent dark:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all duration-200 text-on-surface placeholder-outline dark:placeholder-on-surface-variant/50 font-body outline-none disabled:opacity-50";

  return (
    <main className="h-screen overflow-hidden flex flex-col md:flex-row bg-surface dark:bg-neutral-surface text-on-surface antialiased">
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary dark:bg-gradient-to-br dark:from-[#0F172A] dark:to-[#1E293B]">
        <div className="absolute inset-0 z-0">
          <img
            alt="Professional office background"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIHhlA20yY6chc9e6GdLYATj-lMOFv1hDHAq77fCvvbtaAcoowO8HHxdOB9gG6Blok5MpCljYD7nKohr1N-oAmtVDnQb6aft39y0sj3hRAt0VfgRMnfouyTkojnqCErk_olElO1pqJllZMCFQoNvTHrV-kwJevZzpfKUGXz9d62cBitczj4nMqCQ9SSZxzUnoES37jzhUK84A7MK9tmC-hDJX0-O8vM6JSSB6EoHCTR8duoREy7xmvPllso_Abcu2r_UC5y4G0Cv8"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,53,148,0.85)] to-[rgba(0,74,198,0.75)] dark:from-[rgba(15,23,42,0.9)] dark:to-[rgba(30,41,59,0.85)]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full h-full">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity w-fit">
            <div className="w-10 h-10 bg-white dark:bg-primary rounded-xl flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-primary dark:text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <span className="font-headline font-extrabold text-xl tracking-tighter text-white">Socratic.pro</span>
          </Link>

          <div className="max-w-xl">
            <h1 className="font-headline font-extrabold text-4xl lg:text-6xl text-white leading-tight tracking-tighter mb-6">
              Curating Excellence <br />
              <span className="text-secondary-container dark:text-primary">for Modern Careers</span>
            </h1>
            <p className="text-white/90 dark:text-white/80 text-lg font-light leading-relaxed mb-8">
              Join an elite circle of professionals leveraging high-trust curation and editorial intelligence to navigate the modern job market.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg p-5 rounded-xl border border-white/20 dark:border-white/10">
                <div className="text-secondary-container dark:text-primary font-headline font-bold text-2xl mb-1">50k+</div>
                <div className="text-white/70 dark:text-white/50 text-xs font-label uppercase tracking-widest">Curated Roles</div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg p-5 rounded-xl border border-white/20 dark:border-white/10">
                <div className="text-secondary-container dark:text-primary font-headline font-bold text-2xl mb-1">98%</div>
                <div className="text-white/70 dark:text-white/50 text-xs font-label uppercase tracking-widest">Trust Rating</div>
              </div>
            </div>
          </div>

          <div className="text-white/40 dark:text-white/30 text-xs font-label">
            © 2026 Socratic.pro. High-Trust Career Curation.
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col justify-center bg-surface dark:bg-neutral-surface px-6 py-4 md:px-12 lg:px-24">
        <Link href="/" className="md:hidden flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity w-fit">
          <span className="w-8 h-8 bg-gradient-to-br from-[#003594] to-[#004ac6] dark:from-primary dark:to-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
          </span>
          <span className="font-headline font-extrabold text-xl tracking-tighter text-primary">Socratic.pro</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          <header className="mb-6">
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight mb-1">Create your account</h2>
            <p className="text-on-surface-variant text-sm">Start your journey into curated professional intelligence today.</p>
          </header>

          <div className="mb-5 flex items-center gap-2 px-3 py-2 bg-primary-container/30 rounded-md text-xs text-primary font-body">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Registration is restricted to @socratic.pro emails.
          </div>

          <form action={action} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant font-label tracking-widest uppercase" htmlFor="name">Full Name</label>
              <input
                className={inputClass}
                id="name"
                name="name"
                placeholder="Alexander Hamilton"
                type="text"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant font-label tracking-widest uppercase" htmlFor="email">Email Address</label>
              <input
                className={inputClass}
                id="email"
                name="email"
                placeholder="alexander@editorial.com"
                type="email"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant font-label tracking-widest uppercase" htmlFor="role">Professional Role</label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none`}
                  id="role"
                  name="role"
                  disabled={isPending}
                >
                  <option disabled value="">Select your current role</option>
                  <option value="executive">Executive Leadership</option>
                  <option value="design">Product Design</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Brand Marketing</option>
                  <option value="editorial">Editorial &amp; Content</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-symbols-outlined text-outline dark:text-on-surface-variant">keyboard_arrow_down</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant font-label tracking-widest uppercase" htmlFor="password">Password</label>
              <input
                className={inputClass}
                id="password"
                name="password"
                placeholder="••••••••••••"
                type="password"
                disabled={isPending}
                required
              />
              <p className="text-[10px] text-outline dark:text-on-surface-variant/60 mt-0.5 font-label uppercase tracking-wider">Minimum 12 characters with symbols.</p>
            </div>

            {state?.error && (
              <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md">
                {state.error}
              </div>
            )}

            <div className="pt-2">
              <button
                className="w-full bg-gradient-to-br from-[#003594] to-[#004ac6] dark:from-primary dark:to-primary text-white font-headline font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 dark:hover:bg-blue-600 dark:bg-none dark:bg-primary"
                type="submit"
                disabled={isPending}
              >
                <span className="text-sm">{isPending ? "Signing Up..." : "Sign Up"}</span>
                {!isPending && <span className="material-symbols-outlined text-base">arrow_forward</span>}
              </button>
            </div>

            <GoogleButton />
          </form>

          <footer className="mt-8 text-center">
            <p className="text-on-surface-variant text-xs font-body">
              Already have an account?
              <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" href="/login">Log In</Link>
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">verified_user</span>
                <span className="text-[10px] uppercase font-label tracking-tighter">Secure Data</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">lock</span>
                <span className="text-[10px] uppercase font-label tracking-tighter">Private</span>
              </div>
            </div>
          </footer>

        </div>
      </section>
    </main>
  );
}
