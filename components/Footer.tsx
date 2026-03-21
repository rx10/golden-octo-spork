export default function Footer() {
  return (
    <footer className="w-full py-12 border-t bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-8">
        <div>
          <div className="text-lg font-black font-headline">
            Socratic.pro
          </div>
          <p className="text-xs uppercase tracking-widest">
            Automating your career evolution.
          </p>
        </div>

        <div className="flex gap-6 text-xs uppercase">
          <a>Privacy Policy</a>
          <a>Terms of Service</a>
          <a>Contact</a>
          <a>Careers</a>
        </div>

        <div className="text-xs uppercase">
          © 2026 Socratic.pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}