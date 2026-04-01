"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      toast.success("Admin logged in successfully");
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <div className="max-w-md w-full bg-[#111827]/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 space-y-6 border border-[#3b82f6]/50">
        <h1 className="text-4xl font-extrabold text-white text-center tracking-wider">
          Admin Portal
        </h1>
        <p className="text-center text-[#cbd5e1]">Sign in to your account</p>

        {error && (
          <p className="text-red-400 text-center text-sm font-medium">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <Input
            onChange={handleInputs}
            name="email"
            value={inputs.email}
            type="email"
            placeholder="Email"
            required
            className="w-full bg-[#1e293b] border-[#3b82f6] placeholder:text-[#94a3b8] focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white rounded-xl"
          />

          <Input
            onChange={handleInputs}
            name="password"
            value={inputs.password}
            type="password"
            placeholder="Password"
            required
            className="w-full bg-[#1e293b] border-[#3b82f6] placeholder:text-[#94a3b8] focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white rounded-xl"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#60a5fa] hover:to-[#818cf8] text-white font-bold py-3 rounded-xl shadow-lg transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#64748b]">
          © 2026 HomeworkHub Inc.
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
