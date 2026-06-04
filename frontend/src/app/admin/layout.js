"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowLeftRight,
  Zap,
  LogOut,
  ChevronRight,
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

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/employee/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/95 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-950/30">
              <Zap size={16} className="text-white" />
            </div>

            <div>
              <span className="block text-lg font-extrabold tracking-tight text-white">
                AssetFlow
              </span>
              <span className="block text-xs text-slate-400">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-800/70 px-3 py-3 border border-slate-700/70">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center font-bold text-sm text-white uppercase shrink-0">
              {user.name?.[0] || "A"}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-lg shadow-violet-950/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={17}
                  className={active ? "text-white" : "text-slate-400 group-hover:text-white"}
                />

                <span className="flex-1">{label}</span>

                {active && <ChevronRight size={15} className="text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}