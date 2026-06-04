"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { assetAPI, txnAPI } from "@/lib/api";
import {
  Package,
  CheckSquare,
  Users,
  Clock,
  Plus,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-300",
      border: "border-violet-500/20",
    },
    green: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      border: "border-emerald-500/20",
    },
    pink: {
      bg: "bg-pink-500/10",
      text: "text-pink-300",
      border: "border-pink-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/20",
    },
  };

  const c = colors[color] || colors.violet;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800/80">
      <div
        className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border ${c.border} ${c.bg}`}
      >
        <Icon size={20} className={c.text} />
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="text-4xl font-black tracking-tight text-white">
        {value ?? "—"}
      </p>
    </div>
  );
}

function StatusBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-300">
      {children}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      assetAPI.getStats(),
      txnAPI.getAll({ status: "active" }),
    ])
      .then(([statsRes, txnsRes]) => {
        setStats(statsRes.data);
        setTxns(txnsRes.data.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <Package size={13} />
              Asset Inventory
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Overview of your company asset inventory, availability, and active
              checkouts.
            </p>
          </div>

          <Link
            href="/admin/assets"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
          >
            <Plus size={17} />
            Add Asset
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Assets"
            value={stats?.total}
            icon={Package}
            color="violet"
          />

          <StatCard
            label="Available"
            value={stats?.available}
            icon={CheckSquare}
            color="green"
          />

          <StatCard
            label="Checked Out"
            value={stats?.checkedOut}
            icon={Users}
            color="pink"
          />

          <StatCard
            label="Reserved"
            value={stats?.reserved}
            icon={Clock}
            color="amber"
          />
        </div>

        {/* Active Checkouts */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Active Checkouts
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Latest assets currently assigned to employees.
              </p>
            </div>

            <StatusBadge>{txns.length} active</StatusBadge>
          </div>

          {txns.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-800">
                <Package size={24} className="text-slate-400" />
              </div>

              <h3 className="text-base font-semibold text-white">
                No active checkouts
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Checked-out assets will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-slate-950/70">
                  <tr className="border-b border-slate-800">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Asset
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Employee
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Checked Out
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Return By
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {txns.map((txn) => (
                    <tr
                      key={txn._id}
                      className="border-b border-slate-800 transition last:border-b-0 hover:bg-slate-800/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                            <Package size={16} className="text-violet-300" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {txn.asset?.item_name || "—"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {txn.asset?.category || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">
                          {txn.employee?.name || "—"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {txn.employee?.department || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-300">
                          <CalendarDays size={15} className="text-slate-500" />
                          {txn.checkout_date
                            ? format(new Date(txn.checkout_date), "MMM d, yyyy")
                            : "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-amber-300">
                          <CalendarDays size={15} />
                          {txn.expected_return_date
                            ? format(
                                new Date(txn.expected_return_date),
                                "MMM d, yyyy"
                              )
                            : "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge>Active</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}