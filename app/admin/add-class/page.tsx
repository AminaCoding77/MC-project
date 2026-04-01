"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <div className="min-h-screen px-6 sm:px-10 py-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-wider text-white">
          Create New Class
        </h2>
        <p className="text-[#cbd5e1] mt-2">
          Set up a new class and assign a homeroom teacher
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
                  Class Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Homeroom Teacher
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              <tr className="border-t border-[#3b82f6]/20">
                {/* CLASS NAME */}
                <td className="px-6 py-4">
                  <Input
                    placeholder="Enter class name..."
                    className="w-full rounded-xl bg-[#1e293b] border border-[#3b82f6]/50 text-white placeholder:text-[#94a3b8] focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  />
                </td>

                {/* TEACHER SELECT */}
                <td className="px-6 py-4">
                  <select className="w-full rounded-xl px-4 py-2 bg-[#1e293b] border border-[#3b82f6]/50 text-white text-sm placeholder:text-[#94a3b8] focus:ring-[#3b82f6] focus:border-[#3b82f6]">
                    <option>Select teacher</option>
                  </select>
                </td>

                {/* ACTION */}
                <td className="px-6 py-4">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6]/50 to-[#6366f1]/50 hover:from-[#60a5fa] hover:to-[#818cf8] text-white font-semibold shadow-lg transition-all">
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
