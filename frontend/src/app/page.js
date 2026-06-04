	import Link from "next/link";
import {
  Zap, Package, Users, ArrowLeftRight,
  Shield, Search, Star, ChevronRight, CheckCircle, BarChart3, Clock,
} from "lucide-react";

function Feature({ icon: Icon, title, desc, from, to }) {
  return (
    <div className="card card-hover group relative p-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[14px]"
        style={{ background: `linear-gradient(135deg, ${from}18, ${to}08)` }}
      />
      <div className="relative z-10">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: `linear-gradient(135deg, ${from}30, ${to}15)` }}
        >
          <Icon size={20} style={{ color: from }} />
        </div>
        <h3 className="font-bold text-white text-base mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sub)" }}>{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black" >

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b" style={{ borderColor: "var(--border)", background: "rgba(11,11,19,.85)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e02d6f,#6c3ef4)" }}>
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white" style={{ fontFamily: "'Syne',sans-serif" }}>AssetFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-outline btn-sm cursor-pointer">Sign In</Link>
            <Link href="/register" className="btn-primary btn-sm cursor-pointer">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="hero-grid" />
        <div className="absolute top-24 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(108,62,244,.18)" }} />
        <div className="absolute top-32 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(224,45,111,.12)" }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border" style={{ background: "rgba(108,62,244,.1)", borderColor: "rgba(108,62,244,.25)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#9d7ef8" }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9d7ef8" }}>Company Asset Management</span>
          </div>
          <h1 className="font-black text-6xl leading-none tracking-tight mb-5" style={{ fontFamily: "'Syne',sans-serif" }}>
            <span className="text-white">Track every asset.</span><br />
            <span className="gradient-text">Zero confusion.</span>
          </h1>
          <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--sub)" }}>
            Assign hardware, manage reservation queues, collect condition ratings — all in one place built for IT teams.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5 rounded-xl cursor-pointer">
              Get Started Free <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="btn-outline text-base px-8 py-3.5 rounded-xl cursor-pointer	">Sign In</Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            {["JWT Secured","Role-based Access","Reservation Queue","Condition Ratings"].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--sub)" }}>
                <CheckCircle size={12} style={{ color: "var(--emerald)" }} />{b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--vlight)" }}>Features</p>
            <h2 className="font-black text-4xl text-white" style={{ fontFamily: "'Syne',sans-serif" }}>Everything IT teams need</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature icon={BarChart3}     title="Admin Dashboard"       desc="Real-time metrics: total, available, checked-out, reserved assets at a glance." from="#6c3ef4" to="#9d7ef8" />
            <Feature icon={Package}       title="Asset CRUD"            desc="Create, update, delete assets with Cloudinary image upload and full metadata." from="#e02d6f" to="#ff5fa5" />
            <Feature icon={Search}        title="Advanced Filtering"    desc="Search by name, filter by category, manufacturer, department or status." from="#22c988" to="#34d399" />
            <Feature icon={Users}         title="Role-based Access"     desc="Admin controls everything. Employees browse, reserve and return their assets." from="#f0a500" to="#fbbf24" />
            <Feature icon={ArrowLeftRight} title="Reservation Queue"   desc="Join a live queue for checked-out assets and see the expected return date." from="#06b6d4" to="#67e8f9" />
            <Feature icon={Shield}        title="Return & Rating"       desc="Employees rate condition 1–5 on return. Admins review ratings to track health." from="#8b5cf6" to="#a78bfa" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6" style={{ background: "rgba(17,17,32,.5)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--brand)" }}>How It Works</p>
          <h2 className="font-black text-4xl text-white mb-12" style={{ fontFamily: "'Syne',sans-serif" }}>4 steps from setup to return</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n:"1", t:"Register",        d:"Admin creates accounts for employees with role assignment." },
              { n:"2", t:"Add Assets",      d:"Admin creates asset records with image, serial number and category." },
              { n:"3", t:"Assign or Queue", d:"Admin assigns assets. Employees reserve checked-out assets in queue." },
              { n:"4", t:"Return & Rate",   d:"Employee returns asset with a mandatory 1–5 condition rating." },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--violet))" }}>{s.n}</div>
                <h4 className="font-bold text-white text-base" style={{ fontFamily:"'Syne',sans-serif" }}>{s.t}</h4>
                <p className="text-sm text-center leading-relaxed" style={{ color:"var(--sub)" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12">
            <h2 className="font-black text-3xl text-white mb-4" style={{ fontFamily:"'Syne',sans-serif" }}>
              Ready to manage your <span className="gradient-text">hardware inventory?</span>
            </h2>
            <p className="mb-8" style={{ color:"var(--sub)" }}>Set up your admin account, add assets, and assign them in minutes.</p>
            <Link href="/register" className="btn-primary text-base px-10 py-3.5 rounded-xl">
              Create Account <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 px-6" style={{ borderColor:"var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#e02d6f,#6c3ef4)" }}>
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily:"'Syne',sans-serif" }}>AssetFlow</span>
          </div>
          <p className="text-xs" style={{ color:"var(--sub)" }}>Next.js · Express · MongoDB · Cloudinary · JWT</p>
          <div className="flex gap-5">
            <Link href="/login"    className="text-xs hover:text-white transition-colors" style={{ color:"var(--sub)" }}>Sign In</Link>
            <Link href="/register" className="text-xs hover:text-white transition-colors" style={{ color:"var(--sub)" }}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}