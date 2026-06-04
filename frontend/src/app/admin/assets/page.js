"use client";

import { useEffect, useState, useCallback } from "react";
import { assetAPI, txnAPI, userAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Package, Edit, Users, X } from "lucide-react";

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

const EMPTY = {
  item_name: "",
  category: "Laptop",
  serial_number: "",
  manufacturer: "",
  department: "",
  image: null,
};

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

const outlineBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white";

const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/25 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const badgeClass =
    status === "available"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : status === "checked_out"
      ? "border-pink-500/20 bg-pink-500/10 text-pink-300"
      : status === "reserved"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
      : "border-slate-500/20 bg-slate-500/10 text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${badgeClass}`}
    >
      {status?.replace("_", " ") || "—"}
    </span>
  );
}

function FormFields({ form, setForm, onSubmit, label, busy }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={labelClass}>Item Name</label>
          <input
            required
            className={inputClass}
            value={form.item_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                item_name: e.target.value,
              }))
            }
            placeholder="MacBook Pro 14"
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            required
            className={inputClass}
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
          >
            {CATS.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Serial Number</label>
          <input
            required
            className={inputClass}
            value={form.serial_number}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                serial_number: e.target.value,
              }))
            }
            placeholder="SN-001"
          />
        </div>

        <div>
          <label className={labelClass}>Manufacturer</label>
          <input
            required
            className={inputClass}
            value={form.manufacturer}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                manufacturer: e.target.value,
              }))
            }
            placeholder="Apple"
          />
        </div>

        <div>
          <label className={labelClass}>Department</label>
          <input
            required
            className={inputClass}
            value={form.department}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                department: e.target.value,
              }))
            }
            placeholder="Engineering"
          />
        </div>

        <div>
          <label className={labelClass}>Image Optional</label>
          <input
            type="file"
            accept="image/*"
            className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-violet-500/15 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-violet-300 hover:file:bg-violet-500/25`}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                image: e.target.files?.[0] || null,
              }))
            }
          />
        </div>
      </div>

      <button type="submit" disabled={busy} className={primaryBtn}>
        {busy ? "Saving..." : label}
      </button>
    </form>
  );
}

export default function AdminAssets() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [assignAsset, setAssignAsset] = useState(null);
  const [deleteAsset, setDeleteAsset] = useState(null);

  const [form, setForm] = useState(EMPTY);
  const [assignForm, setAssignForm] = useState({
    employeeId: "",
    expectedReturnDate: "",
  });

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

  useEffect(() => {
    userAPI.getAll().then(({ data }) => {
      setEmployees(data.filter((user) => user.role === "employee"));
    });
  }, []);

  const buildFD = (formData) => {
    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== "image") {
        fd.append(key, value);
      }
    });

    if (formData.image) {
      fd.append("image", formData.image);
    }

    return fd;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await assetAPI.create(buildFD(form));
      toast.success("Asset created!");
      setShowCreate(false);
      setForm(EMPTY);
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await assetAPI.update(editAsset._id, buildFD(form));
      toast.success("Asset updated!");
      setEditAsset(null);
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);

    try {
      await assetAPI.delete(deleteAsset._id);
      toast.success("Asset deleted!");
      setDeleteAsset(null);
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await txnAPI.assign({
        assetId: assignAsset._id,
        employeeId: assignForm.employeeId,
        expectedReturnDate: assignForm.expectedReturnDate,
      });

      toast.success("Asset assigned!");
      setAssignAsset(null);
      setAssignForm({
        employeeId: "",
        expectedReturnDate: "",
      });
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const openEdit = (asset) => {
    setForm({
      item_name: asset.item_name || "",
      category: asset.category || "Laptop",
      serial_number: asset.serial_number || "",
      manufacturer: asset.manufacturer || "",
      department: asset.department || "",
      image: null,
    });

    setEditAsset(asset);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-7 text-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets</h1>
          <p className="mt-1 text-sm text-slate-400">
            {assets.length} assets in inventory
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setShowCreate(true);
          }}
          className={primaryBtn}
        >
          <Plus size={15} />
          Add Asset
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className={`${inputClass} pl-9`}
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={`${inputClass} sm:w-44`}
          value={catFilter}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATS.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="bg-slate-950/70">
                <tr className="border-b border-slate-800">
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Asset
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Serial
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Department
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Status
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Assigned To
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {assets.map((asset) => (
                  <tr
                    key={asset._id}
                    className="border-b border-slate-800 transition last:border-b-0 hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {asset.image ? (
                          <img
                            src={asset.image}
                            alt={asset.item_name}
                            className="h-9 w-9 flex-shrink-0 rounded-lg border border-slate-700 object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                            <Package size={15} className="text-violet-300" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {asset.item_name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {asset.category} · {asset.manufacturer}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-400">
                        {asset.serial_number}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {asset.department}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={asset.status} />
                    </td>

                    <td className="px-5 py-4">
                      {asset.assignedTo ? (
                        <div>
                          <p className="text-sm font-medium text-white">
                            {asset.assignedTo.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {asset.assignedTo.department}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {asset.status !== "checked_out" && (
                          <button
                            type="button"
                            onClick={() => setAssignAsset(asset)}
                            className={outlineBtn}
                          >
                            <Users size={13} />
                            Assign
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEdit(asset)}
                          className={outlineBtn}
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteAsset(asset)}
                          className={dangerBtn}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {assets.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add New Asset"
      >
        <FormFields
          form={form}
          setForm={setForm}
          onSubmit={handleCreate}
          label="Create Asset"
          busy={busy}
        />
      </Modal>

      <Modal
        open={!!editAsset}
        onClose={() => setEditAsset(null)}
        title="Edit Asset"
      >
        <FormFields
          form={form}
          setForm={setForm}
          onSubmit={handleEdit}
          label="Update Asset"
          busy={busy}
        />
      </Modal>

      <Modal
        open={!!assignAsset}
        onClose={() => setAssignAsset(null)}
        title={`Assign "${assignAsset?.item_name}"`}
      >
        <form onSubmit={handleAssign} className="flex flex-col gap-4">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Employee can hold max 3 assets simultaneously.
          </div>

          <div>
            <label className={labelClass}>Select Employee</label>
            <select
              required
              className={inputClass}
              value={assignForm.employeeId}
              onChange={(e) =>
                setAssignForm((prev) => ({
                  ...prev,
                  employeeId: e.target.value,
                }))
              }
            >
              <option value="">Choose employee...</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} — {employee.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Expected Return Date</label>
            <input
              required
              type="date"
              className={inputClass}
              value={assignForm.expectedReturnDate}
              onChange={(e) =>
                setAssignForm((prev) => ({
                  ...prev,
                  expectedReturnDate: e.target.value,
                }))
              }
            />
          </div>

          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? "Assigning..." : "Assign Asset"}
          </button>
        </form>
      </Modal>

      <Modal
        open={!!deleteAsset}
        onClose={() => setDeleteAsset(null)}
        title="Delete Asset"
      >
        <p className="mb-5 text-sm text-slate-400">
          Delete{" "}
          <strong className="font-semibold text-white">
            {deleteAsset?.item_name}
          </strong>
          ? This cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteAsset(null)}
            className={outlineBtn}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className={dangerBtn}
          >
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}