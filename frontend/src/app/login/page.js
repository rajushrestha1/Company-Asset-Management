"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import {  Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-950">

      {/* background effects */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center">
             
            </div>

            <span className="font-bold text-2xl text-white">
              AssetFlow
            </span>
          </Link>

          <p className="text-sm mt-2 text-slate-400">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-8">

          <h2 className="font-bold text-xl text-white mb-6">
            Welcome back
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <Label className="text-white" htmlFor="email">
                Email address
              </Label>

              <div className="relative">
                

                <Input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="text-white"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label className="text-white" htmlFor="password">
                Password
              </Label>

              <div className="relative">
                

                <Input
                  type={show ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="text-white"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <Button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </Button>
              </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 text-white font-semibold py-3 hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm mt-5 text-slate-400">
            No account?{" "}
            <Link
              href="/register"
              className="text-violet-400 font-semibold hover:text-white"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* back link */}
        <p className="text-center text-xs mt-4 text-slate-500">
          <Link href="/" className="hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}