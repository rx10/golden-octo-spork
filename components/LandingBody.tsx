import Link from "next/link";

export default function LandingBody() {
  return (
    <main>
      
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[1.05] mb-8">
              Land Your Dream Job on{" "}
              <span className="text-primary-dim italic">Autopilot</span>.
            </h1>

            <p className="text-on-surface-variant text-xl md:text-2xl max-w-2xl leading-relaxed mb-10 font-medium">
              We scrape thousands of high-intent job listings daily and automate the entire application process, including hyper-personalized resume tailoring for every role.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="editorial-gradient text-on-primary px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-on-surface/5">
                Start My Automated Search
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>

              <button className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl text-base font-bold hover:bg-surface-container-highest transition-colors">
                Watch the Demo
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 p-4 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10">
              <div className="rounded-lg overflow-hidden">
                <img
                  className="w-full h-auto object-cover aspect-[4/3]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuALv4sIZvS7lArZuHaf5BdbItKIvwGKNOIEHIj5YHO9cC04AewsNm_1dDtsZJsez2Bj3-WBxNgxf0Vuc1xXHLgNsiV_Ce4WG9Hv0THu2HzogniG793QwN0X56umZaWcKI5JOFQm96SMEl1shHbx-1FNVHaKMPmxKfo5G20AkG_5O6Fx6eN6S38dzKphEFCzBQdcmXuNxarlq-Aiz1_1E-nqPtOCFPhtQ_WuWQe-6gE4CJkmBZ0DMTjVZTUk11z5PhnD2L1jVO2ncaY"
                  alt="Abstract interface showing career progress metrics"
                />
              </div>
            </div>

            <div className="absolute -top-12 -right-12 w-64 h-64 bg-tertiary-container rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20 text-center md:text-left">
            <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-4 block">
              Engineered for Results
            </span>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
              Precision automation for the modern professional.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between h-[400px] border border-outline-variant/5">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-6">
                  search_insights
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">
                  Smart Job Aggregation
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Our proprietary engine crawls 5,000+ sources including hidden job boards and LinkedIn to find roles before they go viral.
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-outline-variant/10">
                <span className="text-sm font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline">
                  Learn about our sources
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </span>
              </div>
            </div>

          
            <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between h-[400px] border border-outline-variant/5">
              <div>
                <span className="material-symbols-outlined text-4xl text-tertiary mb-6">
                  psychology
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">
                  AI Resume Customization
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  We don't just send one resume. Our AI adjusts your bullet points for every single job description to maximize ATS matching scores.
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-outline-variant/10">
                <span className="text-sm font-semibold text-tertiary flex items-center gap-1 cursor-pointer hover:underline">
                  Explore the AI logic
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </span>
              </div>
            </div>

            
            <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between h-[400px] border border-outline-variant/5">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary-dim mb-6">
                  auto_awesome
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">
                  Automated Applications
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  One click to rule them all. Once a match is found, our system handles the entire submission process across multiple platforms.
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-outline-variant/10">
                <span className="text-sm font-semibold text-primary-dim flex items-center gap-1 cursor-pointer hover:underline">
                  View automation platforms
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/3">
              <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-6">
                A Ledger for Your Progress.
              </h2>
              <p className="text-on-surface-variant mb-12 leading-relaxed">
                Track every application, interview request, and offer in a clean, editorial-style dashboard. No clutter, just the data that moves you forward.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 h-auto bg-primary rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-on-surface">Daily Pulse</h4>
                    <p className="text-sm text-on-surface-variant">
                      Real-time alerts on matching jobs and auto-submissions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1 h-auto bg-outline-variant/30 rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-on-surface">Success Tracker</h4>
                    <p className="text-sm text-on-surface-variant">
                      Visualizing your interview conversion rate over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="lg:w-2/3 w-full">
              <div className="bg-surface-container-low rounded-xl p-6 shadow-xl border border-outline-variant/15">
                <div className="bg-surface-container-lowest rounded-lg h-[500px] flex flex-col overflow-hidden">
                  
                 
                  <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-container"></div>
                      <span className="font-bold text-on-surface">
                        Application Ledger
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Active Search
                      </div>
                    </div>
                  </div>

                 
                  <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                                  
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border-l-4 border-primary">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-surface-container rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary-dim">
                            corporate_fare
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-on-surface">
                            Senior Product Designer
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            Linear • Applied 2h ago
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold uppercase tracking-tight">
                        Processing AI
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border-l-4 border-outline-variant/20">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-surface-container rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary-dim">
                            architecture
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-on-surface">
                            Design Engineer
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            Vercel • Applied yesterday
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-tight">
                        Submitted
                      </div>
                    </div>

                
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border-l-4 border-outline-variant/20 opacity-60">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-surface-container rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary-dim">
                            cloud
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-on-surface">
                            UX Lead
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            Snowflake • Applied 3 days ago
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-tight">
                        Under Review
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto editorial-gradient rounded-3xl p-16 text-center text-on-primary shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8">
              Ready to reclaim your time?
            </h2>

            <p className="text-lg text-on-primary/80 mb-12 max-w-2xl mx-auto font-medium">
              Join 2,500+ professionals who have stopped manual job searching and started landing more interviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-surface-container-lowest text-on-background px-10 py-5 rounded-xl font-bold text-lg hover:scale-95 transition-transform duration-200">
                Get Started Free
              </Link>

              <button className="border border-on-primary/30 text-on-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-on-primary/10 transition-colors">
                View Pricing Plans
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        </div>
      </section>
    </main>
  );
}