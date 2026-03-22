import Link from "next/link";

export default function SignupPage() {
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
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-dim/20 blur-3xl rounded-full -mr-32 -mb-32" />
      </section>

      {/* Right panel */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-24 bg-surface">
        <div className="w-full max-w-md text-center">

          <div className="md:hidden mb-8">
            <span className="font-headline text-on-background font-bold tracking-tighter text-2xl">Socratic.pro</span>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[40px]">groups</span>
            </div>
          </div>

          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">
            Invite Only
          </h2>

          <p className="font-body text-on-surface-variant mb-6 leading-relaxed">
            Socratic.pro is currently in private beta. Access is restricted to invited members only.
          </p>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">mark_email_unread</span>
              <p className="text-sm font-body text-on-surface">
                If you received an invite, check your email to access the platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">schedule</span>
              <p className="text-sm font-body text-on-surface-variant">
                We're onboarding new members gradually to ensure quality.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-headline font-semibold hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Sign In
          </Link>

          <p className="mt-8 font-body text-xs text-outline uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-on-surface-variant">
              Log in here
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}
