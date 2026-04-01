import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return NextResponse.json({ token });
}
