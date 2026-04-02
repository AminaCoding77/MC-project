"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type StudentType = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  enrolledClass?: string | null;
};

type TeacherType = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  subject?: string;
};

type ClassType = {
  _id: string;
  name: string;
  homeroomTeacher?: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    subject?: string;
  };
  teachers: TeacherType[];
  students: StudentType[];
};

const Page = () => {
  const params = useParams();
  const classId = params.classId as string;

  const [classData, setClassData] = useState<ClassType | null>(null);
  const [allTeachers, setAllTeachers] = useState<TeacherType[]>([]);
  const [teacherSelection, setTeacherSelection] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await fetch("/api/admin-classes-bring", {
          method: "POST",
          body: JSON.stringify({ classId: classId }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setClassData(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch class data");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/bring-teachers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setAllTeachers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch teachers");
      }
    };
    fetchClassData();
    fetchAllTeachers();
  }, [classId]);

  // ---------------- ACTIONS ----------------
  const deleteStudent = async (studentId: string) => {
    try {
      const res = await fetch(`/api/admin/student-delete/${studentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Student removed");
        setClassData((prev) => ({
          ...prev!,
          students: prev!.students.filter((s) => s._id !== studentId),
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove student");
    }
  };

  const addTeacher = async () => {
    if (!teacherSelection) return toast.error("Select a teacher first");
    if (!classData) return;

    try {
      const res = await fetch("/api/admin/add-teacher-class", {
        method: "POST",
        body: JSON.stringify({ teacherId: teacherSelection, classId }),
      });
      if (res.ok) {
        toast.success("Teacher added");
        const newTeacher = allTeachers.find((t) => t._id === teacherSelection);
        setClassData((prev) => ({
          ...prev!,
          teachers: [...prev!.teachers, newTeacher!],
        }));
        setTeacherSelection("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add teacher");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-10 py-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-10">
        {/* CLASS HEADER */}
        <div className="space-y-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Class: {classData?.name}
          </h2>
        </div>

        {/* HOMEROOM TEACHER */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {classData?.homeroomTeacher ? (
            <>
              <div className="text-white text-sm sm:text-base">
                <span className="font-semibold">Homeroom:</span>{" "}
                {classData.homeroomTeacher.firstname}{" "}
                {classData.homeroomTeacher.lastname}
              </div>
              <div className="text-slate-300 text-sm sm:text-base">
                <span className="font-semibold text-white">Email:</span>{" "}
                {classData.homeroomTeacher.email}
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-sm sm:text-base">
              No homeroom teacher assigned
            </div>
          )}
        </div>

        {/* STUDENTS TABLE */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Students
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-white/5">
                <tr>
                  {["Name", "Email", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-400 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classData?.students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-3 text-white">
                      {s.firstname} {s.lastname}
                    </td>
                    <td className="px-6 py-3 text-slate-300">{s.email}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => deleteStudent(s._id)}
                        className="text-red-400 hover:text-red-300 hover:underline transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TEACHERS TABLE */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Teachers
            </h3>

            <div className="flex flex-wrap gap-4">
              <select
                value={teacherSelection}
                onChange={(e) => setTeacherSelection(e.target.value)}
                className="rounded-xl px-4 py-2 bg-white/10 border border-white/20 text-slate-200 text-sm sm:text-base backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">Select teacher</option>
                {allTeachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstname} {t.lastname}
                  </option>
                ))}
              </select>

              <Button
                onClick={addTeacher}
                className="px-6 py-2 rounded-xl bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/50 hover:text-white transition shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                Add Teacher
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-white/5">
                <tr>
                  {["Name", "Email"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-400 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classData?.teachers.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-3 text-white">
                      {t.firstname} {t.lastname}
                    </td>
                    <td className="px-6 py-3 text-slate-300">{t.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
