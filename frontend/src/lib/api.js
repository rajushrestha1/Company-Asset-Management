import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("af_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* ── AUTH ── */
export const authAPI = {
  register : (d)  => api.post("/auth/register", d),
  login    : (d)  => api.post("/auth/login", d),
  me       : ()   => api.get("/auth/me"),
};

/* ── ASSETS ── */
export const assetAPI = {
  getAll   : (params) => api.get("/assets", { params }),
  getById  : (id)     => api.get(`/assets/${id}`),
  getStats : ()       => api.get("/assets/stats"),
  create   : (fd)     => api.post("/assets", fd),
  update   : (id, fd) => api.put(`/assets/${id}`, fd),
  delete   : (id)     => api.delete(`/assets/${id}`),
};

/* ── TRANSACTIONS ── */
export const txnAPI = {
  assign        : (d)     => api.post("/transactions/assign", d),
  reserve       : (d)     => api.post("/transactions/reserve", d),
  cancelReserve : (aid)   => api.delete(`/transactions/reserve/${aid}`),
  returnAsset   : (id, d) => api.put(`/transactions/return/${id}`, d),
  getAll        : (p)     => api.get("/transactions", { params: p }),
  getMy         : ()      => api.get("/transactions/my"),
  getQueue      : (aid)   => api.get(`/transactions/queue/${aid}`),
};

/* ── USERS ── */
export const userAPI = {
  getAll  : ()      => api.get("/users"),
  getById : (id)    => api.get(`/users/${id}`),
  update  : (id, d) => api.put(`/users/${id}`, d),
  delete  : (id)    => api.delete(`/users/${id}`),
};

// ✅ ADDED — alias so both import names work across all pages
// admin/dashboard uses txnAPI, other pages use transactionAPI
// now both work without changing any page files
export const transactionAPI = txnAPI;

export default api;