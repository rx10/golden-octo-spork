"use client";

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
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
        };
      };
    };
  }
}

const API_BASE = "https://api.socratic.pro";
type Mode = "otp" | "password";

function LeftPanel() {
  return (
    <section className="hidden md:flex md:w-1/2 bg-on-background relative overflow-hidden items-center justify-center p-16">
      <div className="absolute inset-0 opacity-40">
        <img
          className="w-full h-full object-cover"
          alt="Modern office"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-_dtmemEn1l4ErHD29aF7zgoUQUPWaqKTTpNyksqDLQHws6GuQpEJfGHo-y6VQkpBYNfIHWH1TId1V3IvnEmmBvg2ha_nQiNI6LCm2abD1v7KhzighX3DVAsr-Gmh3tdEOogeXz12FGjn29zkAqez101oO_ULvRoqOGdb5_mfSYHQmFdTNqaeO-Gl18FooKTHAgOdFfuf4U_fX2snxjrlJsNVHan_sofUXKZhvdT1KWN0zZfI_8SjXOcUH4sP7QI9KFf-ACyH8Pk"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/60 to-transparent" />
      <div className="relative z-10 max-w-lg">
        <div className="mb-12">
          <span className="font-headline text-white font-bold tracking-tighter text-3xl">Socratic.pro</span>
          <p className="font-body text-white/80 uppercase tracking-widest text-xs mt-2">Automating your career evolution</p>
        </div>
        <h1 className="font-headline text-5xl font-extrabold text-white leading-tight mb-8">
          Automate the entire application process.
        </h1>
        <div className="space-y-10">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded bg-primary-container/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-white">Hyper-personalized resume tailoring</h3>
              <p className="font-body text-white/70 text-sm mt-1 leading-relaxed">
                Our AI analyzes every job description to rewrite your experience for maximum impact, instantly.
              </p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded bg-primary-container/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white">rocket_launch</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-white">Sovereign Career Management</h3>
              <p className="font-body text-white/70 text-sm mt-1 leading-relaxed">
                Take full control of your professional identity while our engine handles the repetitive heavy lifting.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-dim/20 blur-3xl rounded-full -mr-32 -mb-32" />
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
      // On success, verifyOTP redirects to /dashboard
    });
  }

  const inputClass =
    "w-full bg-surface-container-low border-none rounded-md px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none disabled:opacity-50";

  if (step === 1) {
    return (
      <form onSubmit={handleRequestOTP} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="otp-email">
            Email Address
          </label>
          <input
            type="email"
            id="otp-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            placeholder="socrates@socratic.pro"
            required
            className={inputClass}
          />
        </div>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">{error}</div>
        )}
        <button
          type="submit"
          disabled={isPending || !email.trim()}
          className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold py-4 rounded-md shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isPending ? "Sending Code..." : "Send One-Time Code"}
          {!isPending && <span className="material-symbols-outlined text-sm">send</span>}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="p-3 bg-primary-container/30 rounded-md text-sm text-primary font-body">
        Code sent to <strong>{email}</strong>
      </div>
      <div className="space-y-2">
        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="otp-code">
          One-Time Code
        </label>
        <input
          type="text"
          id="otp-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          disabled={isPending}
          placeholder="123456"
          maxLength={6}
          inputMode="numeric"
          required
          className={`${inputClass} text-center text-2xl tracking-[0.5em] font-headline`}
        />
      </div>
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">{error}</div>
      )}
      <button
        type="submit"
        disabled={isPending || code.length < 6}
        className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold py-4 rounded-md shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isPending ? "Verifying..." : "Verify & Sign In"}
        {!isPending && <span className="material-symbols-outlined text-sm">login</span>}
      </button>
      <button
        type="button"
        onClick={() => { setStep(1); setCode(""); setError(""); }}
        className="w-full text-sm text-on-surface-variant hover:text-on-surface transition-colors font-body"
      >
        Use a different email
      </button>
    </form>
  );
}

function PasswordForm() {
  const [state, action, isPending] = useActionState(login, null);

  const inputClass =
    "w-full bg-surface-container-low border-none rounded-md px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none disabled:opacity-50";

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          disabled={isPending}
          placeholder="socrates@socratic.pro"
          required
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          disabled={isPending}
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">{state.error}</div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold py-4 rounded-md shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isPending ? "Signing In..." : "Sign In"}
        {!isPending && <span className="material-symbols-outlined text-sm">login</span>}
      </button>
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
    <div className="space-y-2">
      {error && <div className="p-2 text-xs text-red-500 bg-red-500/10 rounded-md">{error}</div>}
      {isPending ? (
        <div className="w-full flex items-center justify-center gap-2 py-3.5 text-sm text-on-surface-variant font-body">
          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          Signing in with Google...
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-body font-medium py-3.5 rounded-md hover:bg-surface-container-low transition-colors duration-200"
        >
          <GoogleIcon />
          Google
        </button>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("otp");

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <LeftPanel />

      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-24 bg-surface">
        <div className="w-full max-w-md">

          <div className="md:hidden mb-8">
            <span className="font-headline text-on-background font-bold tracking-tighter text-2xl">Socratic.pro</span>
          </div>

          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Welcome back</h2>
            <p className="font-body text-on-surface-variant mt-2">Sign in to your automated career journey.</p>
          </div>

          {/* Access notice */}
          <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-primary-container/30 rounded-md text-xs text-primary font-body">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Access restricted to @socratic.pro email addresses
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg mb-6">
            {([["otp", "Magic Link"], ["password", "Password"]] as [Mode, string][]).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-headline font-medium transition-colors ${
                  mode === m
                    ? "bg-surface text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "otp" ? <OTPForm /> : <PasswordForm />}

          {/* Divider */}
          <div className="relative py-6 flex items-center">
            <div className="flex-grow h-px bg-surface-variant" />
            <span className="flex-shrink mx-4 font-label text-[10px] uppercase tracking-[0.2em] text-outline">Or continue with</span>
            <div className="flex-grow h-px bg-surface-variant" />
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3">
            <GoogleButton />
            <a
              href={`${API_BASE}/api/auth/github`}
              className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-body font-medium py-3.5 rounded-md hover:bg-surface-container-low transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
