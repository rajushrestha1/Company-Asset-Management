"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("af_user");
    const t = localStorage.getItem("af_token");

    if (u && t) setUser(JSON.parse(u));

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("af_token", data.token);
    localStorage.setItem("af_user", JSON.stringify(data));
    setUser(data);
    router.push(data.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("af_token", data.token);
    localStorage.setItem("af_user", JSON.stringify(data));
    setUser(data);
    router.push(data.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    return data;
  };

  const logout = () => {
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Added missing export
export function useAuth() {
  return useContext(AuthContext);
}