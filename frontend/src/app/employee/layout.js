"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Zap,
  LogOut,
  ChevronRight,
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

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "employee") router.push("/admin/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1020]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-[#e02d6f]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b1020] text-white">
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#111827]">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e02d6f] to-[#6c3ef4]">
              <Zap size={14} className="text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              AssetFlow
            </span>
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
            <p className="text-xs font-medium text-emerald-400">
              Employee
            </p>
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

                {active && (
                  <ChevronRight size={13} className="opacity-50" />
                )}
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
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}