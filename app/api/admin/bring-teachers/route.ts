import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/lib/mongoose";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "No authorization header provided" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "Invalid token format" },
      { status: 401 },
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    await connect();

    // fetch only necessary fields for teachers
    const teachers = await User.find({ role: "teacher" });

    return NextResponse.json(teachers);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
