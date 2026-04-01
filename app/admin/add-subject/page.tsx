"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type TeachersType = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  subject: string;
};

const Page = () => {
  const [teachers, setTeachers] = useState<TeachersType[] | null>(null);
  const [teacherId, setTeacherId] = useState("");
  const [input, setInput] = useState("");

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const BringTeachers = async () => {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();

      const res = await fetch("/api/admin/bring-teachers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      } else {
        console.error("Failed to fetch teachers", res.status);
      }
    };

    BringTeachers();
  }, []);

  const AddSubject = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/add-subject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject: input,
        teacherId: teacherId,
      }),
    });

    if (res.ok) {
      toast.success("Successfully added subject");
      setTeacherId("");
      setInput("");
    } else {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="min-h-screen px-6 sm:px-10 py-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-wider text-white">
          Create New Subject
        </h2>
        <p className="text-[#cbd5e1] mt-2">
          Add a new subject and assign a subject teacher
        </p>
      </div>

      {/* TABLE / FORM */}
      <div className="overflow-hidden rounded-3xl border border-[#3b82f6]/50 bg-[#111827]/80 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* TABLE HEADER */}
            <thead className="bg-[#1e293b]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Subject Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Subject Teacher
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              <tr className="border-t border-[#3b82f6]/20">
                {/* SUBJECT NAME */}
                <td className="px-6 py-4">
                  <Input
                    value={input}
                    onChange={(e) => {
                      handle(e);
                    }}
                    placeholder="Enter subject name..."
                    className="w-full rounded-xl bg-[#1e293b] border border-[#3b82f6]/50 text-white placeholder:text-[#94a3b8] focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  />
                </td>

                {/* TEACHER SELECT */}
                <td className="px-6 py-4">
                  <select
                    className="w-full rounded-xl px-4 py-2 bg-[#1e293b] border border-[#3b82f6]/50 text-white text-sm placeholder:text-[#94a3b8] focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    value={teacherId!}
                    onChange={(e) => setTeacherId(e.target.value)}
                  >
                    <option value="">Select teacher</option>
                    {teachers
                      ?.filter((teacher) => !teacher.subject) // only teachers without a subject
                      .map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.firstname}
                        </option>
                      ))}
                  </select>
                </td>

                {/* ACTION */}
                <td className="px-6 py-4">
                  <Button
                    onClick={() => {
                      AddSubject();
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6]/50 to-[#6366f1]/50 hover:from-[#60a5fa] hover:to-[#818cf8] text-white font-semibold shadow-lg transition-all"
                  >
                    Create
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
