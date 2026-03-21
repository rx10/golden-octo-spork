export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-6">
        <div className="text-2xl font-bold font-headline">
          Socratic.pro
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a className="font-bold border-b-2 border-primary pb-1">
            Features
          </a>
          <a className="text-primary hover:text-black">How it Works</a>
          <a className="text-primary hover:text-black">Pricing</a>
          <a className="text-primary hover:text-black">Login</a>

          <button className="editorial-gradient text-white px-5 py-2 rounded-xl text-xs font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}