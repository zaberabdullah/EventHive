import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signToken, authCookieOptions } from "@/lib/auth";
import { registerSchema, flattenZodError } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields.", fieldErrors: flattenZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists.", fieldErrors: { email: "Email already registered" } },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: "user" });
    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    const res = NextResponse.json(
      { user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
    res.cookies.set(authCookieOptions().name, token, authCookieOptions());
    return res;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
