"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowLeftRight,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/assets", icon: Package, label: "Assets" },
  { href: "/admin/users", icon: Users, label: "Employees" },
  { href: "/admin/transactions", icon: ArrowLeftRight, label: "Transactions" },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/employee/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#192140]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="border-b border-slate-800 px-5 py-5">
        <Link href="/" className="flex h-16 items-center justify-center">
          <img
            src="/ASSET_MANAGEMENT.png"
            alt="AssetFlow"
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {/* User */}
      <div className="border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-800/70 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-sm font-bold uppercase text-white">
            {user.name?.[0] || "A"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white shadow-lg shadow-violet-950/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon
                size={17}
                className={
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white"
                }
              />

              <span className="flex-1">{label}</span>

              {active && <ChevronRight size={15} className="text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 px-3 py-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#192140] text-slate-100">
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center">
          <img
            src="/ASSET_MANAGEMENT.png"
            alt="AssetFlow"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:bg-slate-700"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      <div className="flex min-h-screen lg:min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900/95 lg:flex">
          <SidebarContent />
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] max-w-[85vw] flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}