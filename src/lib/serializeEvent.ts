import type { EventItem, EventCategory, Review } from "@/types";

export function serializeEvent(doc: Record<string, any>): EventItem {
  return {
    id: doc._id.toString(),
    title: doc.title,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    category: doc.category as EventCategory,
    image: doc.image,
    gallery: doc.gallery || [],
    date: new Date(doc.date).toISOString(),
    time: doc.time,
    venue: doc.venue,
    city: doc.city,
    price: doc.price,
    capacity: doc.capacity,
    seatsLeft: doc.seatsLeft,
    rating: doc.rating,
    reviews: (doc.reviews || []).map(
      (r: any): Review => ({
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date(r.createdAt).toISOString(),
      })
    ),
    organizerName: doc.organizerName,
    organizerId: doc.organizerId?.toString?.() ?? "",
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

