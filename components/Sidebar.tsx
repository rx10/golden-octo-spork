"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/jobs", label: "Jobs", icon: "work" },
  { href: "/resumes", label: "Resumes", icon: "description" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/20">
        <span className="font-headline font-bold text-primary text-lg tracking-tight">
          Socratic<span className="text-on-surface">.pro</span>
        </span>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-1 rounded-lg text-xs gap-0.5 transition-colors ${
                  isActive
                    ? "text-primary bg-primary-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <form action={logout}>
            <button
              type="submit"
              className="flex flex-col items-center px-3 py-1 rounded-lg text-xs gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign out
            </button>
          </form>
        </nav>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-surface-container-lowest border-r border-outline-variant/20 shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-outline-variant/10">
          <Link href="/dashboard">
            <span className="font-headline font-bold text-primary text-xl tracking-tight">
              Socratic<span className="text-on-surface">.pro</span>
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-colors ${
                  isActive
                    ? "bg-primary-container text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-outline-variant/10">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
