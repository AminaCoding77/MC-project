import connect from "@/lib/mongoose";
import Class from "@/app/models/Class";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { classId } = await req.json();
    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    await connect();

    const data = await Class.findById(classId).populate(
      "homeroomTeacher teachers students",
    );

    if (!data) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
