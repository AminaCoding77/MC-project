import connect from "@/lib/mongoose";
import Class from "@/app/models/Class";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, classId } = body;

    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "teacherId and classId required" },
        { status: 400 },
      );
    }

    await connect();

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    if (!classDoc.teachers.includes(teacher._id)) {
      classDoc.teachers.push(teacher._id);
      await classDoc.save();
    }

    if (!teacher.classes.includes(classDoc._id)) {
      teacher.classes.push(classDoc._id);
      await teacher.save();
    }

    return NextResponse.json({ success: true, class: classDoc, teacher });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
