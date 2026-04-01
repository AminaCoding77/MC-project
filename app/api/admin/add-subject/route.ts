import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    await connect();
    const { subject, teacherId } = await req.json();

    await User.findByIdAndUpdate(teacherId, {
      subject,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
