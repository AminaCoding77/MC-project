import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/app/models/User";
import Class from "@/app/models/Class";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await connect();

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const classes = await Class.find({
      $or: [{ teachers: user?._id }],
    }).populate("students", "_id firstname lastname email");

    return NextResponse.json({ classes }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
