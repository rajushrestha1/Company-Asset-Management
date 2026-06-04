"use client";

import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { UserPlus, Edit, Trash2, X } from "lucide-react";

const DEPTS = [
  "Engineering",
  "HR",
  "Finance",
  "Design",
  "Sales",
  "Marketing",
  "IT",
  "Operations",
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
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>

          <button
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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { data } = await userAPI.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      const { default: axios } = await import("axios");
      const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const token = localStorage.getItem("af_token");

      await axios.post(`${BASE}/auth/register`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User created!");
      setShowCreate(false);
      fetchUsers();
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
      await userAPI.update(editUser._id, {
        name: form.name,
        department: form.department,
        role: form.role,
      });

      toast.success("User updated!");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);

    try {
      await userAPI.delete(deleteUser._id);
      toast.success("User deleted!");
      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-400";

  const primaryBtn =
    "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

  const outlineBtn =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white";

  const dangerBtn =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/25 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="min-h-screen bg-slate-950 p-7 text-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="mt-1 text-sm text-slate-400">
            {users.filter((user) => user.role === "employee").length} employees registered
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              name: "",
              email: "",
              password: "",
              role: "employee",
              department: "",
            });
            setShowCreate(true);
          }}
          className={primaryBtn}
        >
          <UserPlus size={15} />
          Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-700 border-t-pink-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-slate-950/70">
                <tr className="border-b border-slate-800">
                  <th className="px-5 py-4 font-semibold text-slate-400">User</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Role</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Department</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-800 transition last:border-b-0 hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-violet-600 text-xs font-bold uppercase text-white">
                          {user.name?.[0] || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          user.role === "admin"
                            ? "bg-violet-500/15 text-violet-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {user.department || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setForm({
                              name: user.name,
                              email: user.email,
                              password: "",
                              role: user.role,
                              department: user.department || "",
                            });
                            setEditUser(user);
                          }}
                          className={outlineBtn}
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          onClick={() => setDeleteUser(user)}
                          className={dangerBtn}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-10 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Alice Smith"
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                required
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="alice@co.com"
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                required
                type="password"
                className={inputClass}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min 6 chars"
              />
            </div>

            <div>
              <label className={labelClass}>Role</label>
              <select
                className={inputClass}
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Department</label>
            <select
              className={inputClass}
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            >
              <option value="">Select department...</option>
              {DEPTS.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={busy} className={`${primaryBtn} justify-center`}>
            {busy ? "Creating..." : "Create User"}
          </button>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={`Edit "${editUser?.name}"`}
      >
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Department</label>
            <select
              className={inputClass}
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            >
              <option value="">Select department...</option>
              {DEPTS.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <select
              className={inputClass}
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={busy} className={`${primaryBtn} justify-center`}>
            {busy ? "Saving..." : "Update User"}
          </button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete User">
        <p className="mb-5 text-sm text-slate-400">
          Delete{" "}
          <strong className="font-semibold text-white">
            {deleteUser?.name}
          </strong>
          ? Cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteUser(null)} className={outlineBtn}>
            Cancel
          </button>

          <button onClick={handleDelete} disabled={busy} className={dangerBtn}>
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}