"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff, Mail, Lock, User, Building2, Shield } from "lucide-react";

const DEPARTMENTS = ["Engineering","HR","Finance","Design","Sales","Marketing","IT","Operations","Other"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirmPassword: "", role: "employee", department: "" });
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
      });
      toast.success("Account created successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="hero-grid" />
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(108,62,244,.15)" }} />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(224,45,111,.1)" }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e02d6f,#6c3ef4)" }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: "'Syne',sans-serif" }}>AssetFlow</span>
          </Link>
          <p className="text-sm mt-2" style={{ color: "var(--sub)" }}>Create your account</p>
        </div>

        <div className="card p-8">
          <h2 className="font-bold text-xl text-white mb-6" style={{ fontFamily: "'Syne',sans-serif" }}>Get started</h2>

          {error && <div className="error-msg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <input
                  type="text" required
                  className="input" style={{ paddingLeft: "38px" }}
                  placeholder="Alice Smith"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <input
                  type="email" required
                  className="input" style={{ paddingLeft: "38px" }}
                  placeholder="alice@company.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="label">Role</label>
              <div className="relative">
                <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <select
                  className="input" style={{ paddingLeft: "38px" }}
                  value={form.role}
                  onChange={e => set("role", e.target.value)}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="label">Department</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <select
                  className="input" style={{ paddingLeft: "38px" }}
                  value={form.department}
                  onChange={e => set("department", e.target.value)}
                >
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <input
                  type={show ? "text" : "password"} required
                  className="input" style={{ paddingLeft: "38px", paddingRight: "38px" }}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--sub)", background: "none", border: "none", cursor: "pointer" }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--sub)" }} />
                <input
                  type={show ? "text" : "password"} required
                  className="input" style={{ paddingLeft: "38px" }}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={e => set("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading
                ? <><span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> Creating account...</>
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--sub)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:text-white transition-colors" style={{ color: "var(--vlight)" }}>
              Sign in
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