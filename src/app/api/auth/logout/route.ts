import { NextResponse } from "next/server";
import { authCookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(authCookieOptions().name, "", { ...authCookieOptions(), maxAge: 0 });
  return res;
}
