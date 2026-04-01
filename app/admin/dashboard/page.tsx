"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ClassType = {
  _id: string;
  homeroomTeacher: {
    email: string;
    firstname: string;
    lastname: string;
    _id: string;
  };
  name: string;
  students: {
    firstname: string;
    lastname: string;
    email: string;
    _id: string;
  }[];
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassType[] | null>(null);

  useEffect(() => {
    const BringClasses = async () => {
      const res = await fetch("/api/admin/bring-classes", {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes);
      }
    };
    BringClasses();
  }, []);

  return (
    <div className="min-h-screen px-6 sm:px-10 py-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-10">
      {/* ================= CONTROL ================= */}
      <h2 className="text-3xl font-bold tracking-wider text-white">
        Admin Control
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Classes */}
        <button
          onClick={() => router.push("/admin/management")}
          className="cursor-pointer rounded-2xl p-6 bg-[#111827]/80 backdrop-blur-md border border-[#3b82f6]/50 shadow-2xl hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-white">Manage Classes</h3>
          <p className="text-[#cbd5e1] mt-2">Add students, assign teachers →</p>
        </button>

        {/* Manage Teachers */}
        <button
          onClick={() => router.push("/admin/add-subject")}
          className="cursor-pointer rounded-2xl p-6 bg-[#111827]/80 backdrop-blur-md border border-[#3b82f6]/50 shadow-2xl hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-white">Manage Teachers</h3>
          <p className="text-[#cbd5e1] mt-2">Add or edit teacher info →</p>
        </button>

        {/* Create Class */}
        <button
          onClick={() => router.push("/admin/add-class")}
          className="cursor-pointer rounded-2xl p-6 bg-[#111827]/80 backdrop-blur-md border border-[#3b82f6]/50 shadow-2xl hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-white">Create Class</h3>
          <p className="text-[#cbd5e1] mt-2">Add a new class →</p>
        </button>
      </div>

      {/* ================= CLASSES ================= */}
      <h2 className="text-3xl font-bold tracking-wider text-white">Classes</h2>

      <div className="overflow-hidden rounded-3xl border border-[#3b82f6]/50 bg-[#111827]/80 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b]">
              <th className="px-6 py-4 text-sm font-semibold text-[#94a3b8] uppercase">
                Class
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[#94a3b8] uppercase">
                Teacher
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-[#94a3b8] uppercase">
                Students
              </th>
            </tr>
          </thead>
          <tbody>
            {classes?.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-6 text-center text-[#94a3b8]"
                >
                  No classes available yet
                </td>
              </tr>
            ) : (
              classes?.map((cls) => (
                <tr
                  key={cls._id}
                  onClick={() => router.push(`/admin/classes/${cls._id}`)}
                  className="cursor-pointer border-t border-[#3b82f6]/20 hover:bg-[#1e293b]/50 transition"
                >
                  <td className="px-6 py-3 text-white">{cls.name}</td>
                  <td className="px-6 py-3 text-[#cbd5e1]">
                    {cls.homeroomTeacher
                      ? cls.homeroomTeacher.firstname
                      : "No homeroom teacher"}
                  </td>
                  <td className="px-6 py-3 text-[#cbd5e1]">
                    {cls.students.length}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
