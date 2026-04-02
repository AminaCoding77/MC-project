"use client";

import Sidebar from "@/app/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ClassType = {
  name: string;
  _id: string;
  students: {
    firstname: string;
    lastname: string;
    _id: string;
    email: string;
  }[];
};

export default function TeacherDashboard() {
  const [teacherClasses, setTeacherClasses] = useState<ClassType[] | null>(
    null,
  );
  const { push } = useRouter();

  useEffect(() => {
    const BringClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token, redirecting...");
        return;
      }

      const res = await fetch("/api/teacher/bring-teacher-classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // must be exactly like this
        },
      });

      if (!res.ok) {
        console.error(
          "Unauthorized or failed request",
          res.status,
          await res.text(),
        );
        return;
      }

      const data = await res.json();
      setTeacherClasses(data.classes);
    };

    BringClasses();
  }, []);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Sidebar */}
      <Sidebar userRole="teacher" />

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-8">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-wider">
            Teacher Dashboard
          </h1>
          <p className="text-center text-[#cbd5e1]">
            Here are the classes you teach
          </p>

          {/* Classes grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teacherClasses?.map((cls) => (
              <div
                key={cls._id}
                className="bg-[#111827]/80 backdrop-blur-md border border-[#3b82f6]/50 rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-all hover:shadow-indigo-500/50"
              >
                <h2 className="text-2xl font-bold text-white">{cls.name}</h2>
                <p className="text-[#cbd5e1] mt-2">
                  Click below to manage students or assignments.
                </p>
                <Button
                  onClick={() => {
                    push(`/teacher/classes/${cls._id}`);
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#60a5fa] hover:to-[#818cf8] text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                >
                  View Class
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-xs text-[#64748b]">
            © 2026 HomeworkHub Inc.
          </div>
        </div>
      </main>
    </div>
  );
}
