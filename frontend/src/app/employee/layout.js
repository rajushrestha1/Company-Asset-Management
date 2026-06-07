"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const links = [
  {
    href: "/employee/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/employee/assets",
    icon: Package,
    label: "Browse Assets",
  },
];

export default function EmployeeLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "employee") router.push("/admin/dashboard");
    }
  }, [user, loading, router]);

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1020]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-[#e02d6f]" />
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <Link
          href="/"
          className="flex h-16 items-center justify-center"
          onClick={() => setSidebarOpen(false)}
        >
          <img
            src="/ASSET_MANAGEMENT.png"
            alt="AssetFlow"
            className="h-50 w-50"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22c988] to-[#6c3ef4] text-sm font-bold uppercase text-white">
          {user.name?.[0]}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>
          <p className="text-xs font-medium text-emerald-400">Employee</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-[#e02d6f]/20 to-[#6c3ef4]/20 text-white ring-1 ring-white/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#0b1020] text-white">
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#111827]">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile drawer sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#111827] transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#111827] px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <Link href="/" className="flex items-center">
            <img
              src="/ASSET_MANAGEMENT.png"
              alt="AssetFlow"
              className="h-8 w-auto"
            />
          </Link>

          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22c988] to-[#6c3ef4] text-sm font-bold uppercase text-white">
            {user.name?.[0]}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>

        {/* ── Mobile bottom navigation bar ── */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center border-t border-white/10 bg-[#111827] md:hidden">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors duration-200 ${
                  active
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-br from-[#e02d6f]/30 to-[#6c3ef4]/30 ring-1 ring-white/10"
                      : ""
                  }`}
                >
                  <Icon size={18} />
                </span>
                {label}
              </Link>
            );
          })}

          {/* Logout in bottom nav */}
          <button
            onClick={logout}
            className="flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium text-red-400 transition-colors duration-200 hover:text-red-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}