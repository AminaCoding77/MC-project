import { NextResponse } from "next/server";
import Class from "@/app/models/Class";
import connect from "@/lib/mongoose";

export async function GET() {
  try {
    await connect();

    const classes = await Class.find()
      .populate("students")
      .populate("homeroomTeacher");

    return NextResponse.json({
      classes,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch classes" },
      { status: 500 },
    );
  }
}
