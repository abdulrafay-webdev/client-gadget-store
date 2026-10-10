"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser } from "@/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      setToken(storedToken);
      try {
        const user = await api.getAdminMe();
        setAdmin(user);
      } catch (e) {
        console.error("Token verification failed", e);
        localStorage.removeItem("admin_token");
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.adminLogin(email, pass);
    localStorage.setItem("admin_token", res.access_token);
    setToken(res.access_token);
    setAdmin(res.admin);
    router.push("/admin/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setAdmin(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token && !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
