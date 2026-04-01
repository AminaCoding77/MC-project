import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } else {
      alert(data.error);
    }
  };

  const fetchProtected = async (endpoint: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, fetchProtected, logout };
}
