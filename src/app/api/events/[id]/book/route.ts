import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "You must be logged in to book." }, { status: 401 });
    }
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }
    if (event.seatsLeft <= 0) {
      return NextResponse.json({ error: "This event is sold out." }, { status: 409 });
    }

    event.seatsLeft -= 1;
    await event.save();

    return NextResponse.json({ success: true, seatsLeft: event.seatsLeft });
  } catch (err) {
    console.error("Book event error:", err);
    return NextResponse.json({ error: "Could not complete the booking." }, { status: 500 });
  }
}
