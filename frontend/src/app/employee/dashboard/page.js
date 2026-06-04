"use client";

import { useEffect, useState } from "react";
import { txnAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Package, Clock, RotateCcw, X } from "lucide-react";
import { format } from "date-fns";

function Stars({ value, onChange }) {
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div>
      <div className="mt-1 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange && onChange(n)}
            className={`border-0 bg-transparent p-0 text-[28px] leading-none transition-transform duration-150 hover:scale-125 ${
              n <= value ? "" : "grayscale opacity-30"
            }`}
          >
            ⭐
          </button>
        ))}
      </div>

      <p className="mt-1.5 text-xs text-slate-400">
        {labels[value] || "Select a rating"}
      </p>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnTxn, setReturnTxn] = useState(null);
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data } = await txnAPI.getMy();
      setActive(data.active);
      setHistory(data.history);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a condition rating (1–5)");
      return;
    }

    setBusy(true);

    try {
      await txnAPI.returnAsset(returnTxn._id, {
        condition_rating: rating,
      });

      toast.success("Asset returned successfully!");
      setReturnTxn(null);
      setRating(0);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] p-7 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your current asset assignments and history
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          {active.length} / 3 assets held
        </span>
      </div>

      {/* Active Assets */}
      <h2 className="mb-3 text-base font-bold text-white">
        My Current Assets
      </h2>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-white/20 border-t-[#e02d6f]" />
        </div>
      ) : active.length === 0 ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#111827] p-10 text-center shadow-lg">
          <Package size={32} className="mx-auto mb-3 text-slate-400" />
          <p className="text-sm text-slate-400">
            No assets currently assigned to you.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Browse assets or ask your admin to assign one.
          </p>
        </div>
      ) : (
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {active.map((t) => (
            <div
              key={t._id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-lg transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#151f32]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {t.asset?.image ? (
                    <img
                      src={t.asset.image}
                      alt={t.asset.item_name}
                      className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                      <Package size={20} className="text-violet-300" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.asset?.item_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.asset?.category} · {t.asset?.manufacturer}
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <Clock size={12} />
                Return by:{" "}
                {t.expected_return_date
                  ? format(new Date(t.expected_return_date), "MMM d, yyyy")
                  : "—"}
              </div>

              <div className="text-xs text-slate-400">
                Checked out:{" "}
                {t.checkout_date
                  ? format(new Date(t.checkout_date), "MMM d, yyyy")
                  : "—"}
              </div>

              <button
                onClick={() => {
                  setReturnTxn(t);
                  setRating(0);
                }}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e02d6f] to-[#6c3ef4] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <RotateCcw size={14} />
                Return Asset
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Return History */}
      <h2 className="mb-3 text-base font-bold text-white">
        Return History
      </h2>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-lg">
        {history.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No return history yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Asset
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Checked Out
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Returned
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Condition Rating
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t border-white/10 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-white">
                        {t.asset?.item_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t.asset?.category}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {t.checkout_date
                        ? format(new Date(t.checkout_date), "MMM d, yyyy")
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {t.return_date
                        ? format(new Date(t.return_date), "MMM d, yyyy")
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`text-[13px] ${
                              i <= t.condition_rating
                                ? ""
                                : "grayscale opacity-30"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return Modal */}
      <Modal
        open={!!returnTxn}
        onClose={() => setReturnTxn(null)}
        title={`Return "${returnTxn?.asset?.item_name}"`}
      >
        <form onSubmit={handleReturn} className="flex flex-col gap-5">
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            ⚠️ A condition rating <strong>1–5</strong> is required before the
            return is finalised.
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">
              Condition Rating
            </label>
            <Stars value={rating} onChange={setRating} />
          </div>

          <button
            type="submit"
            disabled={busy || !rating}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#e02d6f] to-[#6c3ef4] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Returning..." : "Confirm Return"}
          </button>
        </form>
      </Modal>
    </div>
  );
}