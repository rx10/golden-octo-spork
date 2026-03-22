"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <section className="hidden md:flex md:w-1/2 bg-on-background relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 opacity-40">
          <img
            className="w-full h-full object-cover"
            alt="Modern minimalist office space with high contrast lighting"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-_dtmemEn1l4ErHD29aF7zgoUQUPWaqKTTpNyksqDLQHws6GuQpEJfGHo-y6VQkpBYNfIHWH1TId1V3IvnEmmBvg2ha_nQiNI6LCm2abD1v7KhzighX3DVAsr-Gmh3tdEOogeXz12FGjn29zkAqez101oO_ULvRoqOGdb5_mfSYHQmFdTNqaeO-Gl18FooKTHAgOdFfuf4U_fX2snxjrlJsNVHan_sofUXKZhvdT1KWN0zZfI_8SjXOcUH4sP7QI9KFf-ACyH8Pk"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/60 to-transparent"></div>

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

        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-dim/20 blur-3xl rounded-full -mr-32 -mb-32"></div>
      </section>

      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-24 bg-surface">
        <div className="w-full max-w-md">

          <div className="md:hidden mb-8">
            <span className="font-headline text-on-background font-bold tracking-tighter text-2xl">Socratic.pro</span>
          </div>

          <div className="mb-10">
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Welcome back</h2>
            <p className="font-body text-on-surface-variant mt-2">Sign in to your automated career journey.</p>
          </div>

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
                placeholder="socrates@mail.com"
                required
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none disabled:opacity-50"
              />
            </div>


            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="font-body text-xs text-primary font-medium hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                disabled={isPending}
                required
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none disabled:opacity-50"
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
              {isPending ? "Signing In..." : "Sign In"}
              {!isPending && <span className="material-symbols-outlined text-sm">login</span>}
            </button>


            <div className="relative py-4 flex items-center">
              <div className="flex-grow h-px bg-surface-variant"></div>
              <span className="flex-shrink mx-4 font-label text-[10px] uppercase tracking-[0.2em] text-outline">Or continue with</span>
              <div className="flex-grow h-px bg-surface-variant"></div>
            </div>


            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-body font-medium py-3.5 rounded-md hover:bg-surface-container-low transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Google
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Don't have an account?
              <Link href="/signup" className="text-primary font-bold hover:underline ml-1 transition-all">Sign Up</Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
