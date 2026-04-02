// File: app/api/admin/student-action/student-delete/[studentId]/route.ts
import connect from "@/lib/mongoose";
import Class from "@/app/models/Class";
import User from "@/app/models/User"; // Assuming students are in User model
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { studentId: string } },
) {
  const { studentId } = params;
  if (!studentId)
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 });

  try {
    await connect();

    await Class.updateMany(
      { students: studentId },
      { $pull: { students: studentId } },
    );

    await User.findByIdAndUpdate(studentId, { enrolledClass: null });

    return NextResponse.json({
      message: "Student removed and enrollment cleared",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to remove student" },
      { status: 500 },
    );
  }
}
