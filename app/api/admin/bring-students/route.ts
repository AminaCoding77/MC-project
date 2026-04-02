import connect from "@/lib/mongoose";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await connect();

  try {
    const authHeader = req.headers.get("authorization");
    console.log("Auth header received:", authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header provided" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1]?.replace(/"/g, "").trim();
    console.log("Token extracted:", token);

    if (!token) {
      return NextResponse.json(
        { error: "Token missing in authorization header" },
        { status: 401 },
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "You do not have permission to access this resource" },
        { status: 403 },
      );
    }

    const students = await User.find({ role: "student" });

    return NextResponse.json(students);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
