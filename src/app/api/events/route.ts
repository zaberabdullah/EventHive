import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { User } from "@/models/User";
import { serializeEvent } from "@/lib/serializeEvent";
import { getCurrentUser } from "@/lib/auth";
import { createEventSchema, flattenZodError } from "@/lib/validators";
import type { FilterQuery } from "mongoose";
import type { EventDocument } from "@/models/Event";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  date_asc: { date: 1 },
  date_desc: { date: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { rating: -1 },
  newest: { createdAt: -1 },
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "date_asc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "8", 10)));
    const excludeId = searchParams.get("excludeId");

    const filter: FilterQuery<EventDocument> = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { venue: { $regex: q, $options: "i" } },
      ];
    }
    if (category && category !== "All") filter.category = category;
    if (city) filter.city = { $regex: `^${city}$`, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (excludeId) filter._id = { $ne: excludeId };

    const sortSpec = SORT_MAP[sort] || SORT_MAP.date_asc;

    const [docs, total] = await Promise.all([
      Event.find(filter)
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(filter),
    ]);

    const events = docs.map(serializeEvent);

    return NextResponse.json({
      events,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("List events error:", err);
    return NextResponse.json({ error: "Could not load events." }, { status: 500 });
  }
}

const FALLBACK_IMAGE = "https://picsum.photos/id/1080/800/600";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "You must be logged in to create an event." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields.", fieldErrors: flattenZodError(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "Your session is invalid. Please log in again." }, { status: 401 });
    }

    const data = parsed.data;
    const event = await Event.create({
      title: data.title,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      category: data.category,
      image: data.image || FALLBACK_IMAGE,
      gallery: data.image ? [data.image] : [FALLBACK_IMAGE],
      date: new Date(data.date),
      time: data.time,
      venue: data.venue,
      city: data.city,
      price: data.price,
      capacity: data.capacity,
      seatsLeft: data.capacity,
      rating: 0,
      reviews: [],
      organizerName: user.name,
      organizerId: user._id,
    });

    return NextResponse.json({ event: serializeEvent(event.toObject()) }, { status: 201 });
  } catch (err) {
    console.error("Create event error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
