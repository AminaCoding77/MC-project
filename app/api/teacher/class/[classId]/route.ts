import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/mongoose";
import { verify } from "jsonwebtoken";
import Event from "@/app/models/Event";

/* =======================
   TYPES
======================= */
interface JwtPayload {
  userId: string;
  role: string;
}

/* =======================
   GET: FETCH EVENTS
======================= */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ classId: string }> }, // ✅ FIXED TYPE
) {
  try {
    await connect();

    /* ---------- AUTH ---------- */
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let payload: JwtPayload;

    try {
      payload = verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------- PARAM (FIXED) ---------- */
    const { classId } = await context.params; // ✅ MUST AWAIT

    if (!classId) {
      return NextResponse.json(
        { error: "classId is required" },
        { status: 400 },
      );
    }

    /* ---------- FETCH EVENTS ---------- */
    const events = await Event.find({
      class: new mongoose.Types.ObjectId(classId),
    })
      .sort({ date: 1 })
      .lean();

    /* ---------- RESPONSE ---------- */
    return NextResponse.json({ events }, { status: 200 });
  } catch (err: any) {
    console.error("FETCH EVENTS ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
