"use client";

import { Button } from "@/components/ui/button";

const Page = () => {
  const studentsWithoutClass: any[] = []; // replace with actual data later

  return (
    <div className="min-h-screen px-6 sm:px-10 py-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-wider text-white">
          Add Students to Class
        </h2>
        <p className="text-[#cbd5e1] mt-2">
          Assign students to their respective classes
        </p>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-3xl border border-[#3b82f6]/50 bg-[#111827]/80 backdrop-blur-md shadow-2xl max-h-[520px] overflow-y-auto">
        {studentsWithoutClass.length === 0 ? (
          <div className="w-full py-20 text-center text-[#94a3b8]">
            No students without classes
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            {/* TABLE HEADER */}
            <thead className="sticky top-0 bg-[#1e293b] z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Student
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase">
                  Class
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-[#94a3b8] uppercase">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>{/* Map real students here when data is available */}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
