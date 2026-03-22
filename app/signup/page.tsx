"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/actions/auth";

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup, null);

  const inputClass =
    "w-full bg-surface-container-low border-none rounded-md px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none disabled:opacity-50";

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Left panel */}
      <section className="hidden md:flex md:w-1/2 bg-on-background relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 opacity-40">
          <img
            className="w-full h-full object-cover"
            alt="Modern minimalist office"
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

      {/* Right panel */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-24 bg-surface">
        <div className="w-full max-w-md">

          <div className="md:hidden mb-8">
            <span className="font-headline text-on-background font-bold tracking-tighter text-2xl">Socratic.pro</span>
          </div>

          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Create your account</h2>
            <p className="font-body text-on-surface-variant mt-2">Welcome to your automated career journey.</p>
          </div>

          {/* Domain restriction notice */}
          <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-primary-container/30 rounded-md text-xs text-primary font-body">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Registration is restricted to @socratic.pro email addresses
          </div>

          <form action={action} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled={isPending}
                placeholder="Socrates"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled={isPending}
                required
                placeholder="you@socratic.pro"
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
              <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold py-4 rounded-md shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isPending ? "Creating Account..." : "Create Account"}
              {!isPending && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline ml-1 transition-all">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <p className="text-[10px] text-outline leading-relaxed font-body uppercase tracking-widest text-center">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline">Terms</Link>{" "}
              and{" "}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
