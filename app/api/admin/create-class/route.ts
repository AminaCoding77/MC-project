import { NextResponse } from "next/server";
import Class from "@/app/models/Class";
import connect from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    const { name, teacherId } = await req.json();
    await connect();

    const newClass = await Class.create({
      name,
      homeroomTeacher: teacherId,
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to create class" },
      { status: 500 },
    );
  }
}
