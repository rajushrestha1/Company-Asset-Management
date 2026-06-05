"use client";

import Link from "next/link";

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

const primaryBtn =
  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition";

const outlineBtn =
  "inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-6 py-3 font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition";

const cardClass =
  "relative rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm";

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className={`${cardClass} group p-6 overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition" />

      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 flex items-center justify-center mb-4">
          <Icon size={20} className="text-violet-400" />
        </div>

        <h3 className="font-bold text-white text-base mb-2">{title}</h3>

        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-xl">AssetFlow</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className={outlineBtn}>
              Sign In
            </Link>
            <Link href="/register" className={primaryBtn}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-20 px-6">
        
        {/* grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border border-violet-500/30 bg-violet-500/10">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Company Asset Management
            </span>
          </div>

          <h1 className="font-black text-5xl md:text-6xl leading-tight mb-5">
            <span>Track every asset.</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Zero confusion.
            </span>
          </h1>

          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Assign hardware, manage reservation queues, collect condition ratings —
            all in one place built for IT teams.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className={primaryBtn}>
              Get Started Free <ChevronRight size={18} />
            </Link>
            <Link href="/login" className={outlineBtn}>
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap text-sm text-slate-400">
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

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Features
            </p>
            <h2 className="font-black text-4xl">
              Everything IT teams need
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              desc="Condition rating system (1–5) for asset lifecycle tracking."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center">

          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">
            How It Works
          </p>

          <h2 className="font-black text-4xl mb-12">
            4 steps from setup to return
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: "1", t: "Register", d: "Admin creates employee accounts." },
              { n: "2", t: "Add Assets", d: "Create assets with metadata." },
              { n: "3", t: "Assign", d: "Assign or reserve assets." },
              { n: "4", t: "Return", d: "Return with condition rating." },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-3">
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center font-black">
                  {s.n}
                </div>

                <h4 className="font-bold">{s.t}</h4>

                <p className="text-sm text-slate-400 text-center">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-12">

            <h2 className="font-black text-3xl mb-4">
              Ready to manage your{" "}
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                hardware inventory?
              </span>
            </h2>

            <p className="text-slate-400 mb-8">
              Set up your admin account and start managing assets in minutes.
            </p>

            <Link href="/register" className={primaryBtn}>
              Create Account <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between flex-wrap gap-4">

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center">
              <Zap size={13} />
            </div>
            <span className="font-bold">AssetFlow</span>
          </div>

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
    </div>
  );
}