"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DEPARTMENTS = [
  "Engineering", "HR", "Finance", "Design",
  "Sales", "Marketing", "IT", "Operations", "Other",
];

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#192140]">      

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          
       
          <Link href="/" className="flex h-16 items-center justify-center">
  <img
    src="/ASSET_MANAGEMENT.png"
    alt="AssetFlow"
    className="h-50 w-50  "
  />
</Link>
          <p className="text-sm mt-2 text-slate-400">Create your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-8">

          <h2 className="font-bold text-xl text-white mb-6">Get started</h2>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Alice Smith"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="text-white"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="alice@company.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="text-white"
              />
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department" className="text-white">Department</Label>
              <select
                id="department"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/40 text-white px-3 py-2 outline-none focus:border-violet-500"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
              >
                <option value="">Select department...</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type={show ? "text" : "password"}
                required
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="text-white"
              />
              <Button
                type="button"
                onClick={() => setShow(!show)}
                variant="link"
                className="text-white"
              >
                {show ? "Hide password" : "Show password"}
              </Button>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={show ? "text" : "password"}
                required
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                className="text-white"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-violet-600 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-5 text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-white font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back */}
        <p className="text-center text-xs mt-4 text-slate-500">
          <Link href="/" className="hover:text-white">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}