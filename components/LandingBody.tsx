"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingBody() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#003594] to-[#004ac6] dark:from-primary dark:to-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-[18px] sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </span>
              <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter font-headline">Socratic.pro</span>
            </div>
            <div className="hidden md:flex gap-6">
              <button onClick={() => scrollTo('features')} className="text-on-surface-variant font-medium hover:text-primary transition-colors">Features</button>
              <button onClick={() => scrollTo('how-it-works')} className="text-on-surface-variant font-medium hover:text-primary transition-colors">How it Works</button>
              <button onClick={() => scrollTo('pricing')} className="text-on-surface-variant font-medium hover:text-primary transition-colors">Pricing</button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-1 sm:p-2 sm:mr-2 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors text-on-surface"
              aria-label="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <Link href="/login" className="hidden sm:inline-block px-3 sm:px-5 py-2 text-on-surface font-medium hover:opacity-80 transition-all text-sm sm:text-base">Log In</Link>
            <Link href="/signup" className="editorial-gradient text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-[0.98] transition-all whitespace-nowrap">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-widest uppercase font-label">AI-Powered Job Search Automation</span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] tracking-tight mb-6 sm:mb-8 text-balance">
                Land Your Dream Job on <span className="text-primary block sm:inline">Autopilot</span>
              </h1>
              <p className="text-lg sm:text-xl text-on-surface-variant mb-8 sm:mb-10 leading-relaxed max-w-lg">
                70% of resumes are rejected by ATS before a human ever reads them. Professionals waste 10–15 hours per week on applications that go nowhere. Socratic.pro closes the loop — from job discovery to submission — automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/signup" className="editorial-gradient text-white px-6 sm:px-8 py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
                  Start My Automated Search
                </Link>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="bg-surface-container-high text-on-surface px-6 sm:px-8 py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch the Demo
                </button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-[2rem] shadow-2xl border border-outline-variant/10 relative z-10 transition-colors duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline font-bold text-xl">Success Metrics</h3>
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <div className="space-y-6">
                  <div className="flex items-end gap-3 h-48">
                    <div className="bg-primary/20 w-full rounded-t-lg h-1/2"></div>
                    <div className="bg-primary/40 w-full rounded-t-lg h-3/4"></div>
                    <div className="editorial-gradient w-full rounded-t-lg h-full"></div>
                    <div className="bg-primary/60 w-full rounded-t-lg h-2/3"></div>
                    <div className="bg-primary/30 w-full rounded-t-lg h-4/5"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl transition-colors duration-300">
                      <p className="text-xs text-on-surface-variant font-label font-semibold mb-1 uppercase tracking-wider">Apps Sent</p>
                      <p className="text-3xl font-black font-headline text-primary">1,248</p>
                    </div>
                    <div className="p-4 bg-secondary-container rounded-2xl transition-colors duration-300">
                      <p className="text-xs text-on-secondary-fixed-variant font-label font-semibold mb-1 uppercase tracking-wider">Interviews</p>
                      <p className="text-3xl font-black font-headline text-on-secondary-container">14</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:absolute lg:-bottom-14 lg:-left-8 mt-6 lg:mt-0 p-4 sm:p-6 bg-surface-container-lowest lg:glass-panel rounded-2xl shadow-xl border border-outline-variant/10 lg:border-white/20 z-20 transition-colors duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Close up portrait of a professional woman smiling confidently with warm natural lighting in an office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCqN2-zP-yk0egw3KEotL6MCg3fGlvHOO9r_wXmVu15YjWwMsqpJqxpjDiOt2fTmoLvNs0wgSp7jeNGnywCyugWDIke1-d8_xKPTZxgSWYUDWVhY0PGRVbgz5nJqHy6Bdec8r6Rza5uoIyPRtobM8gaFnFyX6dWLaggzFHJPLjbRfQfaOcxLdMIbiHoiGrbe3BAL26q0Nhuit9hkFn8Gv8y4IzzSSgLUqbxvMNtOrOpLj6VJ89JozwipVgvXTL1VJvPZoN3m3_Ul4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-on-surface">&quot;Secured 3 offers in 2 weeks&quot;</p>
                    <p className="text-[10px] sm:text-xs text-on-surface-variant">Elena M., Product Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-16 sm:py-24 bg-surface-container-low transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="mb-12 sm:mb-16 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight mb-4">The only platform that closes the loop — <span className="text-primary">end to end.</span></h2>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl">From discovery to submission, every step is handled. No more copying and pasting. No more one-size-fits-all resumes.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-on-surface">5,000+ Source Aggregation</h3>
                <p className="text-on-surface-variant leading-relaxed">Our proprietary crawl engine scrapes job boards, company career pages, LinkedIn, and niche platforms every 4 hours — before roles go viral.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-secondary-container text-3xl">auto_fix_high</span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-on-surface">Per-Role AI Customization</h3>
                <p className="text-on-surface-variant leading-relaxed">Our AI rewrites your bullet points, professional summary, and skills section for every individual job description — not a generic template.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-tertiary text-3xl">query_stats</span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-on-surface">ATS Score Prediction</h3>
                <p className="text-on-surface-variant leading-relaxed">A real-time scoring engine tells you exactly how your resume will perform against each ATS — before it&apos;s ever submitted.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">send_and_archive</span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-on-surface">Automated Submission</h3>
                <p className="text-on-surface-variant leading-relaxed">For every matched role, we securely submit your tailored application directly to hiring portals. You get notified. You do nothing else.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-secondary-container text-3xl">bar_chart</span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-on-surface">Editorial Dashboard</h3>
                <p className="text-on-surface-variant leading-relaxed">Track every application, response, and interview invite in a unified command center. Replaces the spreadsheet, forever.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-[1.5rem] sm:rounded-3xl group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-tertiary text-3xl">lock</span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4 text-on-surface">Privacy-First</h3>
                <p className="text-on-surface-variant leading-relaxed">Your data is encrypted at rest and in transit. We never sell or share your information with third-party recruiters or data brokers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline mb-4 text-on-surface">Onboard once. Apply everywhere.</h2>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">The complete pipeline — from first login to signed offer letter.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-outline-variant/30"></div>
              {[
                {
                  step: "01",
                  icon: "person_add",
                  title: "Build your profile",
                  body: "Enter your work experience, education, skills, and target roles once. Set your salary floor, preferred locations, and whether to enable auto-apply.",
                },
                {
                  step: "02",
                  icon: "manage_search",
                  title: "We find the matches",
                  body: "Our aggregation engine crawls 5,000+ sources every 4 hours. Roles are scored against your profile using semantic similarity — only high-fit jobs surface.",
                },
                {
                  step: "03",
                  icon: "rocket_launch",
                  title: "AI tailors and submits",
                  body: "For each match, our AI generates a fully tailored resume — custom bullets, summary, and skills — then submits the application and logs the result.",
                },
              ].map(({ step, icon, title, body }) => (
                <div key={step} className="flex flex-col items-center text-center relative">
                  <div className="w-20 h-20 rounded-full editorial-gradient flex items-center justify-center mb-6 shadow-lg z-10">
                    <span className="material-symbols-outlined text-white text-3xl">{icon}</span>
                  </div>
                  <span className="text-xs font-black font-label text-primary tracking-widest uppercase mb-2">{step}</span>
                  <h3 className="text-xl font-bold font-headline text-on-surface mb-3">{title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">{body}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/signup" className="inline-flex items-center gap-2 editorial-gradient text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Get started in 2 minutes
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview / Ledger */}
        <section className="hidden md:block py-16 sm:py-24 px-4 sm:px-8 overflow-hidden bg-surface-container-low transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline mb-4 text-on-surface">A Ledger for Your Progress</h2>
              <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto px-2">Track every interaction, every status change, and every interview invite in a unified, high-fidelity command center.</p>
            </div>
            <div className="bg-surface-container-high rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-4 md:p-8 shadow-inner overflow-hidden transition-colors duration-300">
              <div className="bg-surface-container-lowest rounded-xl sm:rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden transition-colors duration-300">
                <div className="border-b border-surface-container p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    <div className="px-3 sm:px-4 py-1.5 rounded-full bg-primary-fixed text-primary text-[10px] sm:text-xs font-bold font-label">All Applications</div>
                    <div className="px-3 sm:px-4 py-1.5 rounded-full text-on-surface-variant text-[10px] sm:text-xs font-medium font-label">Active (12)</div>
                    <div className="px-3 sm:px-4 py-1.5 rounded-full text-on-surface-variant text-[10px] sm:text-xs font-medium font-label">Interviews (4)</div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <span className="material-symbols-outlined text-on-surface-variant">search</span>
                    <span className="material-symbols-outlined text-on-surface-variant">tune</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-surface-container-low transition-colors duration-300">
                        <th className="p-4 sm:p-6 text-xs font-bold font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Company</th>
                        <th className="p-4 sm:p-6 text-xs font-bold font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Role</th>
                        <th className="p-4 sm:p-6 text-xs font-bold font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Status</th>
                        <th className="p-4 sm:p-6 text-xs font-bold font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Applied Date</th>
                        <th className="p-4 sm:p-6 text-xs font-bold font-label uppercase text-on-surface-variant tracking-widest whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-on-surface">
                      <tr className="hover:bg-surface-container-low transition-colors group">
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-black dark:bg-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                            <span className="font-bold">Aether Systems</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 font-medium whitespace-nowrap">Sr. Backend Engineer</td>
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-wider">Interview Scheduled</span>
                        </td>
                        <td className="p-4 sm:p-6 text-on-surface-variant whitespace-nowrap">Oct 24, 2026</td>
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <span className="material-symbols-outlined text-primary cursor-pointer">visibility</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors group">
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">V</div>
                            <span className="font-bold">Veridian AI</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 font-medium whitespace-nowrap">Principal Product Designer</td>
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-[10px] font-black uppercase tracking-wider">Application Sent</span>
                        </td>
                        <td className="p-4 sm:p-6 text-on-surface-variant whitespace-nowrap">Oct 22, 2026</td>
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <span className="material-symbols-outlined text-primary cursor-pointer">visibility</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container">
                        <td className="p-4 sm:p-6 border-b-0 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
                            <span className="font-bold">Lumina Lab</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 font-medium whitespace-nowrap">Data Strategy Lead</td>
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-[10px] font-black uppercase tracking-wider">Under Review</span>
                        </td>
                        <td className="p-4 sm:p-6 text-on-surface-variant whitespace-nowrap">Oct 19, 2026</td>
                        <td className="p-4 sm:p-6 whitespace-nowrap">
                          <span className="material-symbols-outlined text-primary cursor-pointer">visibility</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline mb-4 text-on-surface">Simple, transparent pricing</h2>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto">Start free. Upgrade when you&apos;re ready to go full autopilot.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 flex flex-col">
                <p className="text-xs font-black font-label uppercase tracking-widest text-on-surface-variant mb-4">Free</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-5xl font-black font-headline text-on-surface">$0</span>
                  <span className="text-on-surface-variant font-body mb-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Up to 10 applications/month",
                    "AI resume generation",
                    "Basic job matching",
                    "Application status tracking",
                    "Email support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full text-center bg-surface-container text-on-surface py-3 rounded-xl font-bold font-headline hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                  Get started free
                </Link>
              </div>

              {/* Pro */}
              <div className="editorial-gradient rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl">
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Most Popular</div>
                <p className="text-xs font-black font-label uppercase tracking-widest text-white/70 mb-4">Pro</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-5xl font-black font-headline text-white">$29</span>
                  <span className="text-white/70 font-body mb-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Unlimited applications",
                    "Priority job matching",
                    "Advanced ATS optimization",
                    "Auto-apply to matching roles",
                    "Interview prep suggestions",
                    "Dedicated account manager",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                      <span className="material-symbols-outlined text-white text-[18px]">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full text-center bg-white text-primary py-3 rounded-xl font-bold font-headline hover:bg-opacity-90 transition-colors">
                  Start Pro free for 7 days
                </Link>
              </div>
            </div>
            <p className="text-center text-xs text-on-surface-variant mt-6">No credit card required for free plan. Cancel anytime.</p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto editorial-gradient rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 Q 50 0 100 100" fill="none" stroke="currentcolor" strokeWidth="0.5"></path>
              </svg>
            </div>
            <div className="relative z-10 w-full">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-headline mb-6 sm:mb-8 tracking-tighter">Ready to reclaim your time?</h2>
              <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 sm:mb-12 max-w-xl mx-auto font-light leading-relaxed">
                The average job posting gets 250+ applicants. Yours will be first — with a resume written specifically for that role.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full">
                <Link href="/signup" className="bg-white text-primary px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-extrabold text-base sm:text-lg shadow-lg hover:bg-opacity-90 transition-all sm:scale-100 hover:sm:scale-105 active:scale-95 w-full sm:w-auto text-center">
                  Get Started Free
                </Link>
                <button
                  onClick={() => scrollTo('pricing')}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-extrabold text-base sm:text-lg shadow-lg hover:bg-white/20 transition-all w-full sm:w-auto"
                >
                  View Pricing Plans
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low py-12 sm:py-16 px-4 sm:px-8 border-t border-outline-variant/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12 sm:mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#003594] to-[#004ac6] dark:from-primary dark:to-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-[18px] sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                </span>
                <span className="text-2xl sm:text-3xl font-black text-primary font-headline tracking-tighter">Socratic.pro</span>
              </div>
              <p className="text-on-surface-variant max-w-xs text-sm sm:text-base font-body leading-relaxed">
                Empowering professionals through ethical automation and intelligent career curation.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
              <div className="space-y-4">
                <p className="text-xs font-bold font-label uppercase tracking-widest text-on-surface">Platform</p>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollTo('features')} className="text-sm text-on-surface-variant hover:text-primary transition-colors">Find Jobs</button></li>
                  <li><button onClick={() => scrollTo('pricing')} className="text-sm text-on-surface-variant hover:text-primary transition-colors">Pricing</button></li>
                  <li><button onClick={() => scrollTo('how-it-works')} className="text-sm text-on-surface-variant hover:text-primary transition-colors">Resources</button></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold font-label uppercase tracking-widest text-on-surface">Company</p>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link></li>
                  <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="/careers">Careers</Link></li>
                  <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold font-label uppercase tracking-widest text-on-surface">Legal</p>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
                  <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link></li>
                  <li><Link className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="/cookies">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center pt-8 border-t border-outline-variant/10 gap-6 md:gap-4">
            <p className="text-xs text-on-surface-variant font-label text-center md:text-left w-full md:w-auto">© 2026 Socratic Intelligence. All rights reserved.</p>
            <div className="flex gap-6 justify-center w-full md:w-auto">
              <Link className="text-on-surface-variant hover:text-primary transition-colors" href="https://socratic.pro"><span className="material-symbols-outlined text-lg">public</span></Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors" href="https://linkedin.com/company/socratic-pro"><span className="material-symbols-outlined text-lg">share</span></Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors" href="mailto:hello@socratic.pro"><span className="material-symbols-outlined text-lg">mail</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
