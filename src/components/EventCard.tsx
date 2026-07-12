import Link from "next/link";
import Image from "next/image";
import type { EventItem } from "@/types";

const CATEGORY_COLOR: Record<string, string> = {
  Music: "bg-ember/15 text-ember-dark",
  Workshop: "bg-spotlight/20 text-spotlight-dark",
  Festival: "bg-stage/10 text-stage",
  Tech: "bg-spotlight/20 text-spotlight-dark",
  Comedy: "bg-ember/15 text-ember-dark",
  Art: "bg-stage/10 text-stage",
  Food: "bg-ember/15 text-ember-dark",
  Sports: "bg-spotlight/20 text-spotlight-dark",
};

export default function EventCard({ event }: { event: EventItem }) {
  const dateLabel = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/events/${event.id}`} className="ticket-card h-full">
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-stage">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLOR[event.category] || "bg-white/90 text-ink"}`}>
          {event.category}
        </span>
        {event.seatsLeft <= 10 && event.seatsLeft > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white">
            {event.seatsLeft} seats left
          </span>
        )}
        {event.seatsLeft === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-xl leading-tight tracking-wide text-ink">{event.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-mist">{event.shortDescription}</p>

        <div className="mt-3 flex items-center gap-1 text-sm text-mist">
          <svg className="h-4 w-4 text-spotlight-dark" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          <span className="truncate">{event.venue}, {event.city}</span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm text-mist">
          <svg className="h-4 w-4 text-spotlight-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="font-mono text-xs">{dateLabel} · {event.time}</span>
        </div>
      </div>

      <div className="ticket-perforation flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4 text-spotlight-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.03 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" /></svg>
          <span className="font-mono text-sm font-semibold text-ink">{event.rating.toFixed(1)}</span>
        </div>
        <span className="font-mono text-lg font-bold text-ink">
          {event.price === 0 ? "Free" : `$${event.price}`}
        </span>
        <span className="btn-primary !px-4 !py-2 text-xs">View Details</span>
      </div>
    </Link>
  );
}
