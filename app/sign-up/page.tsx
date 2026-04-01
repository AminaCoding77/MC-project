"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const SignupPage = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleInputs = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const createAcc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Successfully signed up!");
        router.push("/login");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <div className="max-w-md w-full bg-[#111827]/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 space-y-6 border border-[#3b82f6]/50">
        <h1 className="text-4xl font-extrabold text-white text-center tracking-wider">
          Create Account
        </h1>
        <p className="text-center text-[#cbd5e1]">
          Sign up as a student or teacher
        </p>

        <form className="space-y-5" onSubmit={createAcc}>
          <div className="flex gap-4">
            <Input
              name="firstname"
              value={inputs.firstname}
              onChange={handleInputs}
              type="text"
              placeholder="First Name"
              required
              className="flex-1 bg-[#1e293b] border-[#3b82f6] placeholder:text-[#94a3b8] text-white rounded-xl focus:ring-[#3b82f6] focus:border-[#3b82f6]"
            />
            <Input
              name="lastname"
              value={inputs.lastname}
              onChange={handleInputs}
              type="text"
              placeholder="Last Name"
              required
              className="flex-1 bg-[#1e293b] border-[#3b82f6] placeholder:text-[#94a3b8] text-white rounded-xl focus:ring-[#3b82f6] focus:border-[#3b82f6]"
            />
          </div>

          <Input
            name="email"
            value={inputs.email}
            onChange={handleInputs}
            type="email"
            placeholder="Email"
            required
            className="w-full bg-[#1e293b] border-[#3b82f6] placeholder:text-[#94a3b8] text-white rounded-xl focus:ring-[#3b82f6] focus:border-[#3b82f6]"
          />

          <Input
            name="password"
            value={inputs.password}
            onChange={handleInputs}
            type="password"
            placeholder="Password"
            required
            className="w-full bg-[#1e293b] border-[#3b82f6] placeholder:text-[#94a3b8] text-white rounded-xl focus:ring-[#3b82f6] focus:border-[#3b82f6]"
          />

          <select
            name="role"
            value={inputs.role}
            onChange={handleInputs}
            className="w-full bg-[#1e293b] border-[#3b82f6] text-white rounded-xl px-3 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#60a5fa] hover:to-[#818cf8] text-white font-bold py-3 rounded-xl shadow-lg transition-all"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm text-[#94a3b8]">
          <span>Already have an account? </span>
          <span
            className="text-[#60a5fa] font-semibold hover:underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Log in
          </span>
        </div>

        <div className="mt-6 text-center text-xs text-[#64748b]">
          © 2026 HomeworkHub Inc.
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
