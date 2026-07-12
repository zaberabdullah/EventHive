import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { MapPin, CalendarDays, Clock, Users, Star, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventGallery from "@/components/EventGallery";
import BookButton from "@/components/BookButton";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { serializeEvent } from "@/lib/serializeEvent";
import type { Metadata } from "next";

async function getEvent(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doc = await Event.findById(id).lean();
  if (!doc) return null;
  return serializeEvent(doc);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await getEvent(params.id);
  if (!event) return { title: "Event not found — EventHive" };
  return { title: `${event.title} — EventHive`, description: event.shortDescription };
}

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  await connectDB();
  const relatedDocs = await Event.find({ category: event.category, _id: { $ne: event.id } })
    .sort({ rating: -1 })
    .limit(4)
    .lean();
  const related = relatedDocs.map(serializeEvent);

  const dateLabel = new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/explore" className="inline-flex items-center gap-1 text-sm font-medium text-mist hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back to Explore
          </Link>

          <div className="mt-4 grid gap-10 lg:grid-cols-3">
            {/* Left: gallery + description + reviews */}
            <div className="lg:col-span-2">
              <span className="inline-block rounded-full bg-spotlight/20 px-3 py-1 text-xs font-semibold text-spotlight-dark">
                {event.category}
              </span>
              <h1 className="mt-3 font-display text-4xl tracking-wide text-ink sm:text-5xl">{event.title}</h1>

              <div className="mt-6">
                <EventGallery images={event.gallery} title={event.title} />
              </div>

              {/* Overview */}
              <section className="mt-10">
                <h2 className="font-display text-2xl tracking-wide text-ink">Overview</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/80">{event.fullDescription}</p>
              </section>

              {/* Key info / specs */}
              <section className="mt-10">
                <h2 className="font-display text-2xl tracking-wide text-ink">Key information</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SpecRow icon={CalendarDays} label="Date" value={dateLabel} />
                  <SpecRow icon={Clock} label="Time" value={event.time} />
                  <SpecRow icon={MapPin} label="Venue" value={`${event.venue}, ${event.city}`} />
                  <SpecRow icon={Users} label="Capacity" value={`${event.capacity} attendees`} />
                </div>
              </section>

              {/* Reviews */}
              <section className="mt-10">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl tracking-wide text-ink">Reviews</h2>
                  <span className="flex items-center gap-1 text-sm font-semibold text-spotlight-dark">
                    <Star className="h-4 w-4 fill-current" /> {event.rating.toFixed(1)} ({event.reviews.length})
                  </span>
                </div>

                {event.reviews.length === 0 ? (
                  <p className="mt-3 text-sm text-mist">No reviews yet — be the first to attend and leave one.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {event.reviews.map((r, i) => (
                      <div key={i} className="rounded-card border border-black/5 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-ink">{r.userName}</p>
                          <span className="flex items-center gap-1 text-sm font-semibold text-spotlight-dark">
                            <Star className="h-4 w-4 fill-current" /> {r.rating}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-mist">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right: booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-card border border-black/5 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-3xl font-bold text-ink">
                    {event.price === 0 ? "Free" : `$${event.price}`}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-spotlight-dark">
                    <Star className="h-4 w-4 fill-current" /> {event.rating.toFixed(1)}
                  </span>
                </div>

                <div className="mt-5">
                  <BookButton eventId={event.id} initialSeatsLeft={event.seatsLeft} price={event.price} />
                </div>

                <div className="mt-6 space-y-3 border-t border-black/5 pt-5 text-sm text-mist">
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-spotlight-dark" /> {dateLabel}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-spotlight-dark" /> {event.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-spotlight-dark" /> {event.venue}, {event.city}</p>
                </div>

                <p className="mt-5 border-t border-black/5 pt-4 text-xs text-mist">
                  Hosted by <span className="font-semibold text-ink">{event.organizerName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Related events */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl tracking-wide text-ink">You might also like</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {related.map((r) => <EventCard key={r.id} event={r} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-black/5 bg-white p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-spotlight-dark" />
      <div>
        <p className="text-xs uppercase tracking-wide text-mist">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
