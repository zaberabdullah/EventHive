import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { serializeEvent } from "@/lib/serializeEvent";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    await connectDB();
    const doc = await Event.findById(params.id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ event: serializeEvent(doc) });
  } catch (err) {
    console.error("Get event error:", err);
    return NextResponse.json({ error: "Could not load this event." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    await connectDB();
    const doc = await Event.findById(params.id);
    if (!doc) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const isOwner = doc.organizerId.toString() === session.id;
    const isAdmin = session.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "You can only delete events you created." }, { status: 403 });
    }

    await doc.deleteOne();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "Could not delete this event." }, { status: 500 });
  }
}
