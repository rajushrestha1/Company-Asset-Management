"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Zap,
  Package,
  Users,
  ArrowLeftRight,
  Shield,
  Search,
  ChevronRight,
  CheckCircle,
  BarChart3,
} from "lucide-react";

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition hover:border-violet-500/40 hover:bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/5 opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/10">
          <Icon size={20} className="text-violet-400" />
        </div>

        <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#192140] text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex h-16 items-center">
  <img
    src="/ASSET_MANAGEMENT.png"
    alt="AssetFlow"
    className="h-40 w-auto object-contain"
  />
</Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-full border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-violet-500/10 hover:text-white"
            >
              <Link href="/login">Sign In</Link>
            </Button>

            <Button
              size="sm"
              asChild
              className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white hover:opacity-90"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative px-4 pb-20 pt-36 sm:px-6">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Company Asset Management
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            <span>Track every asset.</span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
              Zero confusion.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Assign hardware, manage reservation queues, collect condition ratings
            — all in one place built for IT teams.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 px-8 font-bold text-white hover:opacity-90"
            >
              <Link href="/register" className="inline-flex items-center gap-2">
                Get Started Free <ChevronRight size={18} />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-violet-500/10 hover:text-white"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            {[
              "JWT Secured",
              "Role-based Access",
              "Reservation Queue",
              "Condition Ratings",
            ].map((b) => (
              <div key={b} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              Features
            </p>
            <h2 className="text-3xl font-black sm:text-4xl">
              Everything IT teams need
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={BarChart3}
              title="Admin Dashboard"
              desc="Real-time metrics: total, available, checked-out, reserved assets."
            />
            <Feature
              icon={Package}
              title="Asset CRUD"
              desc="Create, update, delete assets with full metadata and images."
            />
            <Feature
              icon={Search}
              title="Advanced Filtering"
              desc="Search and filter assets by category, department or status."
            />
            <Feature
              icon={Users}
              title="Role-based Access"
              desc="Admins manage everything. Employees manage their assets."
            />
            <Feature
              icon={ArrowLeftRight}
              title="Reservation Queue"
              desc="Live queue for checked-out assets with expected return tracking."
            />
            <Feature
              icon={Shield}
              title="Return & Rating"
              desc="Condition rating system 1–5 for asset lifecycle tracking."
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-900/40 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-400">
            How It Works
          </p>

          <h2 className="mb-12 text-3xl font-black sm:text-4xl">
            4 steps from setup to return
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { n: "1", t: "Register", d: "Admin creates employee accounts." },
              { n: "2", t: "Add Assets", d: "Create assets with metadata." },
              { n: "3", t: "Assign", d: "Assign or reserve assets." },
              { n: "4", t: "Return", d: "Return with condition rating." },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-violet-600 font-black text-white">
                  {s.n}
                </div>

                <h4 className="font-bold text-white">{s.t}</h4>

                <p className="text-center text-sm text-slate-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm sm:p-12">
            <h2 className="mb-4 text-3xl font-black">
              Ready to manage your{" "}
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                hardware inventory?
              </span>
            </h2>

            <p className="mb-8 text-slate-400">
              Set up your admin account and start managing assets in minutes.
            </p>

            <Button
              size="lg"
              asChild
              className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 px-8 font-bold text-white hover:opacity-90"
            >
              <Link href="/register" className="inline-flex items-center gap-2">
                Create Account <ChevronRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex h-16 items-center">
  <img
    src="/ASSET_MANAGEMENT.png"
    alt="AssetFlow"
    className="h-50 w-50 object-contain"
  />
</Link>

          <p className="text-xs text-slate-400">
            Next.js · Express · MongoDB · Cloudinary · JWT
          </p>

          <div className="flex gap-5 text-xs text-slate-400">
            <Link href="/login" className="hover:text-white">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}