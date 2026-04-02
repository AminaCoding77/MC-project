import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Event from "@/app/models/Event";
import jwt from "jsonwebtoken";

/* =======================
   DB CONNECTION
======================= */
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/* =======================
   POST: CREATE EVENT
======================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    /* ---------- AUTH ---------- */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      userId = decoded.id;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    /* ---------- BODY ---------- */
    const body = await req.json();

    console.log("BODY:", body); // DEBUG (remove later)

    const {
      title,
      description,
      type,
      date,
      endDate,
      location,
      score,
      classId,
    } = body;

    /* ---------- VALIDATION ---------- */
    if (!title || !type || !date || !classId) {
      return NextResponse.json(
        { error: "title, type, date, and classId are required" },
        { status: 400 },
      );
    }

    /* ---------- CREATE EVENT ---------- */
    const event = new Event({
      title,
      description,
      type, // ✅ FIXED
      date,
      endDate,
      location,
      score,
      createdBy: userId, // ✅ from JWT
      class: classId, // ✅ from frontend
    });

    await event.save();

    return NextResponse.json({ event }, { status: 201 });
  } catch (err: any) {
    console.error("EVENT CREATE ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

/* =======================
   OPTIONAL: GET EVENTS
======================= */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
