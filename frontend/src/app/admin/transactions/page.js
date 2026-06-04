"use client";

import { useEffect, useState } from "react";
import { txnAPI } from "@/lib/api";
import { Package } from "lucide-react";
import { format } from "date-fns";

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xs ${
            i <= n ? "opacity-100" : "grayscale opacity-30"
          }`}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

export default function AdminTransactions() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchTxns = async (status) => {
    setLoading(true);

    try {
      const { data } = await txnAPI.getAll(status ? { status } : {});
      setTxns(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxns(filter);
  }, [filter]);

  const primaryBtn =
    "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90";

  const outlineBtn =
    "inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white";

  return (
    <div className="min-h-screen bg-slate-950 p-7 text-slate-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">All Transactions</h1>
        <p className="mt-1 text-sm text-slate-400">
          Full checkout and return history
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["", "All"],
          ["active", "Active"],
          ["returned", "Returned"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={filter === value ? primaryBtn : outlineBtn}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
              <thead className="bg-slate-950/70">
                <tr className="border-b border-slate-800">
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Asset
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Employee
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Assigned By
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Checked Out
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Return By
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Returned
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Rating
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
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
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                          <Package size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {txn.asset?.item_name || "—"}
                          </p>
                          <p className="truncate font-mono text-xs text-slate-400">
                            {txn.asset?.serial_number || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">
                        {txn.employee?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {txn.employee?.department || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {txn.assignedBy?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {txn.checkout_date
                        ? format(new Date(txn.checkout_date), "MMM d, yy")
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-amber-300">
                      {txn.expected_return_date
                        ? format(new Date(txn.expected_return_date), "MMM d, yy")
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {txn.return_date ? (
                        format(new Date(txn.return_date), "MMM d, yy")
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {txn.condition_rating ? (
                        <Stars n={txn.condition_rating} />
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          txn.status === "active"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {txns.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}