import connect from "@/lib/mongoose";
import User from "@/app/models/User";
import Class from "@/app/models/Class";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, classId } = body;

    if (!studentId || !classId) {
      return NextResponse.json(
        { error: "Missing studentId or classId" },
        { status: 400 },
      );
    }

    await connect();

    await User.findByIdAndUpdate(studentId, {
      enrolledClass: classId,
    });

    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: studentId },
    });

    return NextResponse.json({ message: "Student added to class" });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
