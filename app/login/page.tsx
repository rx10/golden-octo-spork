"use client";

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { login, requestOTP, verifyOTP, googleAuth } from "@/actions/auth";

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

const API_BASE = "https://api.socratic.pro";
type Mode = "otp" | "password";

function LeftPanel() {
  return (
    <section className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-900 dark:bg-neutral-surface">
      {/* Background Image with Dark Color Wash */}
      <div className="absolute inset-0 z-0">
        <img alt="Professional Career Path" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU8W1DPbxvE_a-W5gZXQLLefT2vuQnb-nldhycbBI6j9oWEOl-zry9XRk2xDfNJkM-oRFRd8KBeQ6BngO3vyXqDJQ8ySF6XP7RdwhWYtyMU99LEzfTVV_7JTYoRiuRwoGAKP8Stdb-9z-XCQBHjaXPwGEvbFUajJSza_CEnUlFoJknM6YGf7rJBGQcRbEWUaRFfRafPz2-Fye1YYFBIMjjMLwZmAcEzTDvQxDD4qUsipcPMO-taYTKCA8zLOpBOUx6eAS7zZfzHDU" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#004AC6]/80 via-slate-900/95 to-slate-900 dark:from-blue-900/80"></div>
      </div>
      {/* Header Content */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-90 transition-opacity w-fit">
          <div className="w-10 h-10 bg-white dark:bg-primary rounded-xl flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-primary dark:text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
          </div>
          <span className="font-headline font-extrabold text-xl tracking-tighter text-white">Socratic.pro</span>
        </Link>
        <div className="max-w-xl">
          <h1 className="font-headline text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Curating Excellence for <span className="text-white/90 dark:text-primary">Modern Careers.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            Join an elite network of professionals who prioritize high-trust editorial intelligence over noisy job boards. Your next chapter deserves a better script.
          </p>
        </div>
      </div>
      {/* Footer Quote */}
      <div className="relative z-10 mt-auto">
        <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 max-w-md">
          <p className="italic text-white dark:text-slate-200 mb-4 text-sm">"Socratic.pro transformed how I view career progression. It’s the difference between finding a job and finding a calling."</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">EM</div>
            <div>
              <p className="font-bold text-xs text-white">Elena Marks</p>
              <p className="text-[10px] text-slate-300 dark:text-slate-400">Lead Design Strategist, Veridia Global</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OTPForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await requestOTP(email);
      if (result?.error) {
        setError(result.error);
      } else {
        setStep(2);
      }
    });
  }

  function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await verifyOTP(email, code);
      if (result && "error" in result && result.error) {
        setError(result.error);
      }
    });
  }

  if (step === 1) {
    return (
      <form onSubmit={handleRequestOTP} className="space-y-4 w-full">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase" htmlFor="otp-email">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">mail</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none disabled:opacity-50"
              id="otp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="john@company.com"
              required
            />
          </div>
        </div>
        {error && (
          <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md">{error}</div>
        )}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending || !email.trim()}
            className="w-full py-3 bg-primary text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100 text-sm"
          >
            {isPending ? "Sending Code..." : "Send One-Time Code"}
            {!isPending && <span className="material-symbols-outlined text-sm">send</span>}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4 w-full">
      <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-xs text-primary font-body">
        Code sent to <strong>{email}</strong>
      </div>
      <div className="space-y-1">
        <label className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase" htmlFor="otp-code">
          One-Time Code
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">password</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 transition-all outline-none disabled:opacity-50 text-center tracking-[0.5em] font-headline text-lg"
            id="otp-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            disabled={isPending}
            placeholder="123456"
            maxLength={6}
            inputMode="numeric"
            required
          />
        </div>
      </div>
      {error && (
        <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md">{error}</div>
      )}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending || code.length < 6}
          className="w-full py-3 bg-primary text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100 text-sm"
        >
          {isPending ? "Verifying..." : "Verify & Sign In"}
          {!isPending && <span className="material-symbols-outlined text-sm">login</span>}
        </button>
      </div>
      <button
        type="button"
        onClick={() => { setStep(1); setCode(""); setError(""); }}
        className="w-full text-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-body mt-2"
      >
        Use a different email
      </button>
    </form>
  );
}

function PasswordForm() {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-4 w-full">
      {/* Email Address */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase" htmlFor="email">Email Address</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">mail</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
            id="email"
            name="email"
            placeholder="john@company.com"
            type="email"
            disabled={isPending}
            required
          />
        </div>
      </div>
      {/* Password */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase" htmlFor="password">Password</label>
          <a className="text-[10px] font-bold text-primary hover:underline" href="#">Forgot Password?</a>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">lock</span>
          <input
            className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none"
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            disabled={isPending}
            required
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" type="button">
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
        </div>
      </div>
      {state?.error && (
        <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md">{state.error}</div>
      )}
      {/* Action Button */}
      <div className="pt-2">
        <button
          className="w-full py-3 bg-primary text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100 text-sm"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Signing In..." : "Log In"}
        </button>
      </div>
    </form>
  );
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
    <div className="w-full space-y-2">
      {error && <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md">{error}</div>}
      {isPending ? (
        <div className="w-full flex items-center justify-center gap-2 py-3 text-xs text-slate-500 font-body">
          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
          Signing in...
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full shadow-sm"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-xs font-semibold text-slate-700 dark:text-white">Google</span>
        </button>
      )}
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("password");

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] h-screen overflow-hidden">
      <LeftPanel />

      <section className="flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-[380px] space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity w-fit">
              <span className="w-8 h-8 bg-gradient-to-br from-[#003594] to-[#004ac6] dark:from-primary dark:to-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </span>
              <span className="font-headline font-extrabold text-2xl tracking-tighter text-primary">Socratic.pro</span>
            </Link>
          </div>

          <div className="space-y-1">
            <h2 className="font-headline text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Log in to your curated career dashboard.</p>
          </div>

          <div className="w-full">
            {/* Mode tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-5">
              {([["password", "Password"], ["otp", "Magic Link"]] as [Mode, string][]).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-headline font-medium transition-colors ${mode === m
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === "password" ? <PasswordForm /> : <OTPForm />}

            {/* Secondary Options */}
            <div className="relative py-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800/50"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid gap-3">
              <GoogleButton />
              <a
                href={`${API_BASE}/api/auth/github`}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full shadow-sm"
              >
                <svg className="w-4 h-4 text-slate-700 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span className="text-xs font-semibold text-slate-700 dark:text-white">GitHub</span>
              </a>
            </div>

            <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-xs">
              Don't have an account?
              <Link className="text-primary font-bold hover:underline underline-offset-4 transition-colors ml-1" href="/signup">Sign Up</Link>
            </p>
            {/* Legal Subtext */}
            <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-600 text-center leading-relaxed">
              By logging in, you agree to our <a className="underline" href="#">Terms of Service</a> and <a className="underline" href="#">Privacy Policy</a>. We value your data security above all else.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 hidden lg:block pointer-events-none z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center opacity-60 dark:opacity-40">
          <p className="text-[10px] font-headline text-white/50 dark:text-slate-500 tracking-widest uppercase">© 2026 Socratic.pro Intelligence</p>
          <div className="flex gap-6 pointer-events-auto">
            <a className="text-[10px] font-headline text-white/50 dark:text-slate-500 tracking-widest uppercase hover:text-primary" href="#">Help</a>
            <a className="text-[10px] font-headline text-white/50 dark:text-slate-500 tracking-widest uppercase hover:text-primary" href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
