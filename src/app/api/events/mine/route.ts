import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { serializeEvent } from "@/lib/serializeEvent";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  await connectDB();
  const docs = await Event.find({ organizerId: session.id }).sort({ createdAt: -1 }).lean();
  const events = docs.map(serializeEvent);

  return NextResponse.json({ events });
}
