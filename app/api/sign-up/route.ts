import connect from "@/lib/mongoose";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, password, role } = body;

    if (!["student", "teacher"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either 'student' or 'teacher'" },
        { status: 400 },
      );
    }

    await connect();

    const hashedPass = await hash(password, 6);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPass,
      role,
    });

    return NextResponse.json({
      message: "Success",
      user: { id: newUser._id, role: newUser.role },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
