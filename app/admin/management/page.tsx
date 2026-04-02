"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type StudentType = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  enrolledClass: string | null;
};

type ClassType = {
  _id: string;
  name: string;
  homeroomTeacher: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  students: StudentType[];
};

const Page = () => {
  const [students, setStudents] = useState<StudentType[] | null>(null);
  const [classes, setClasses] = useState<ClassType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [classSelections, setClassSelections] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/admin/bring-students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error(
            "Failed to fetch students:",
            res.status,
            await res.text(),
          );
          return;
        }

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/admin/bring-classes");
        if (!res.ok) return;
        const data = await res.json();
        setClasses(data.classes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectChange = (studentId: string, value: string) => {
    setClassSelections((prev) => ({ ...prev, [studentId]: value }));
  };

  const addStudentIntoClass = async (studentId: string) => {
    const classId = classSelections[studentId];
    if (!classId) {
      toast.error("Please select a class first");
      return;
    }

    try {
      const res = await fetch("/api/admin/add-student", {
        method: "POST",
        body: JSON.stringify({ studentId, classId }),
      });

      if (res.ok) {
        toast.success("Student successfully added");
        setStudents(
          (prev) =>
            prev?.map((s) =>
              s._id === studentId ? { ...s, enrolledClass: classId } : s,
            ) || null,
        );
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 md:px-10 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-wide">
            Assign Students
          </h2>
          <p className="text-[#94a3b8] mt-2">
            Add students into classes efficiently
          </p>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-xl border border-[#3b82f6]/40 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#1e293b]/90 backdrop-blur-xl z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-10 text-[#64748b]"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : students &&
                  students.filter((s) => !s.enrolledClass).length > 0 ? (
                  students
                    .filter((s) => !s.enrolledClass)
                    .map((student) => (
                      <tr
                        key={student._id}
                        className="border-t border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-semibold">
                              {student.firstname} {student.lastname}
                            </span>
                            <span className="text-xs text-[#64748b]">
                              {student.email}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={classSelections[student._id] || ""}
                            onChange={(e) =>
                              handleSelectChange(student._id, e.target.value)
                            }
                            className="w-full rounded-xl px-4 py-2 bg-[#1e293b] border border-[#3b82f6]/40 text-white text-sm focus:ring-2 focus:ring-[#3b82f6] outline-none transition"
                          >
                            <option value="">Select class</option>
                            {classes?.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => addStudentIntoClass(student._id)}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#60a5fa] hover:to-[#818cf8] text-white font-semibold shadow-lg transition-all"
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-10 text-[#64748b]"
                    >
                      No students available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
