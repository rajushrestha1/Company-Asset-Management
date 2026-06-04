"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="hero-grid" />
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(108,62,244,.15)" }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(224,45,111,.1)" }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e02d6f,#6c3ef4)" }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: "'Syne',sans-serif" }}>AssetFlow</span>
          </Link>
          <p className="text-sm mt-2" style={{ color: "var(--sub)" }}>Sign in to your account</p>
        </div>

        <div className="card p-8">
          <h2 className="font-bold text-xl text-white mb-6" style={{ fontFamily: "'Syne',sans-serif" }}>Welcome back</h2>

          {error && <div className="error-msg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <input
                  type="email" required
                  className="input" style={{ paddingLeft: "38px" }}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <input
                  type={show ? "text" : "password"} required
                  className="input" style={{ paddingLeft: "38px", paddingRight: "38px" }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--sub)", background: "none", border: "none", cursor: "pointer" }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-1">
              {loading
                ? <><span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> Signing in...</>
                : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--sub)" }}>
            No account?{" "}
            <Link href="/register" className="font-semibold hover:text-white transition-colors" style={{ color: "var(--vlight)" }}>
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-4">
          <Link href="/" className="hover:text-white transition-colors" style={{ color: "var(--sub)" }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}