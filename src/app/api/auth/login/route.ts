import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword, signToken, authCookieOptions } from "@/lib/auth";
import { loginSchema, flattenZodError } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields.", fieldErrors: flattenZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
    const res = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(authCookieOptions().name, token, authCookieOptions());
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
