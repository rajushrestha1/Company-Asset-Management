"use client";

import { useEffect, useState, useCallback } from "react";
import { assetAPI, txnAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Search, Package, Clock, Users, X } from "lucide-react";
import { format } from "date-fns";

const CATS = [
  "Laptop",
  "Monitor",
  "Phone",
  "Tablet",
  "Keyboard",
  "Mouse",
  "Headset",
  "Other",
];

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

export default function EmployeeAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("");
  const [queue, setQueue] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await assetAPI.getAll({
        search,
        category: catFilter,
      });

      setAssets(data);
    } finally {
      setLoading(false);
    }
  }, [search, catFilter]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleReserve = async (asset) => {
    setBusy(true);

    try {
      const { data } = await txnAPI.reserve({
        assetId: asset._id,
      });

      toast.success(data.message);
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const handleCancelReserve = async (assetId) => {
    setBusy(true);

    try {
      await txnAPI.cancelReserve(assetId);
      toast.success("Reservation cancelled");
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const viewQueue = async (asset) => {
    try {
      const { data } = await txnAPI.getQueue(asset._id);
      setQueue({ asset, data });
    } catch {
      toast.error("Could not load queue");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] p-7 text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Browse Assets</h1>
        <p className="mt-1 text-sm text-slate-400">
          View available assets and join reservation queues
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-[#111827] py-2.5 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 sm:w-40"
          value={catFilter}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-white/20 border-t-[#e02d6f]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <div
              key={a._id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-lg transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#151f32]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.item_name}
                      className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                      <Package size={20} className="text-violet-300" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold leading-snug text-white">
                      {a.item_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {a.category} · {a.manufacturer}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                    a.status === "available"
                      ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : a.status === "checked_out"
                      ? "border border-pink-400/20 bg-pink-400/10 text-pink-400"
                      : a.status === "reserved"
                      ? "border border-amber-400/20 bg-amber-400/10 text-amber-400"
                      : "border border-slate-400/20 bg-slate-400/10 text-slate-400"
                  }`}
                >
                  {a.status?.replace("_", " ")}
                </span>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1 text-xs text-slate-400">
                <span>
                  Department:{" "}
                  <span className="text-white">{a.department}</span>
                </span>

                {a.status === "checked_out" && a.expectedReturnDate && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock size={11} />
                    Returns:{" "}
                    {format(new Date(a.expectedReturnDate), "MMM d, yyyy")}
                  </span>
                )}

                {a.lastConditionRating && (
                  <span>
                    Last rating:{" "}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-[11px] ${
                          i <= a.lastConditionRating
                            ? ""
                            : "grayscale opacity-30"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </span>
                )}
              </div>

              {/* Queue Info */}
              {a.reservationQueue?.length > 0 && (
                <button
                  onClick={() => viewQueue(a)}
                  className="flex items-center gap-1.5 text-left text-xs font-semibold text-violet-300 transition hover:text-violet-200"
                >
                  <Users size={12} />
                  {a.reservationQueue.length} in queue — view
                </button>
              )}

              {/* Action */}
              <div className="mt-auto pt-1">
                {a.status === "available" && (
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 py-2 text-center text-xs font-bold uppercase tracking-wide text-emerald-400">
                    Available — contact admin to assign
                  </div>
                )}

                {(a.status === "checked_out" || a.status === "reserved") && (
                  <button
                    onClick={() => handleReserve(a)}
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    📋 Reserve a Spot
                  </button>
                )}

                {a.status === "maintenance" && (
                  <div className="rounded-xl border border-slate-400/20 bg-slate-400/10 py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                    Under Maintenance
                  </div>
                )}
              </div>
            </div>
          ))}

          {assets.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center text-sm text-slate-400 md:col-span-2 lg:col-span-3">
              No assets found
            </div>
          )}
        </div>
      )}

      {/* Queue Modal */}
      <Modal
        open={!!queue}
        onClose={() => setQueue(null)}
        title={`Queue — "${queue?.asset?.item_name}"`}
      >
        {queue && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
              <Clock size={14} />
              <span>
                Expected return:{" "}
                <strong>
                  {queue.data.expectedReturnDate
                    ? format(
                        new Date(queue.data.expectedReturnDate),
                        "MMMM d, yyyy"
                      )
                    : "—"}
                </strong>
              </span>
            </div>

            {queue.data.queue?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {queue.data.queue.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border-b border-white/10 py-2 last:border-b-0"
                  >
                    <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/15 text-xs font-black text-violet-300">
                      #{i + 1}
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e02d6f] to-[#6c3ef4] text-xs font-bold uppercase text-white">
                      {r.employee?.name?.[0] || "?"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {r.employee?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {r.employee?.department} · Reserved{" "}
                        {r.reservedAt
                          ? format(new Date(r.reservedAt), "MMM d")
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-slate-400">
                No one in queue yet
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}