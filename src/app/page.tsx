import Link from "next/link";
import { Music2, Wrench, Tent, Cpu, Mic2, Palette, UtensilsCrossed, Trophy, Users, MapPin, CalendarCheck, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import HeroSearch from "@/components/HeroSearch";
import FAQAccordion from "@/components/FAQAccordion";
import NewsletterForm from "@/components/NewsletterForm";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { serializeEvent } from "@/lib/serializeEvent";
import type { EventCategory } from "@/types";

const CATEGORY_ICONS: Record<EventCategory, React.ElementType> = {
  Music: Music2,
  Workshop: Wrench,
  Festival: Tent,
  Tech: Cpu,
  Comedy: Mic2,
  Art: Palette,
  Food: UtensilsCrossed,
  Sports: Trophy,
};

const CATEGORY_STYLES: Record<EventCategory, { bg: string; border: string; icon: string }> = {
  Music: { bg: "bg-spotlight/10", border: "border-spotlight/25", icon: "text-spotlight-dark" },
  Workshop: { bg: "bg-ember/10", border: "border-ember/25", icon: "text-ember-dark" },
  Festival: { bg: "bg-stage/10", border: "border-stage/20", icon: "text-stage-light" },
  Tech: { bg: "bg-spotlight-dark/10", border: "border-spotlight-dark/25", icon: "text-spotlight-dark" },
  Comedy: { bg: "bg-ember-dark/10", border: "border-ember-dark/25", icon: "text-ember-dark" },
  Art: { bg: "bg-stage-light/10", border: "border-stage-light/25", icon: "text-stage-light" },
  Food: { bg: "bg-spotlight-light/20", border: "border-spotlight-light/40", icon: "text-spotlight-dark" },
  Sports: { bg: "bg-ember-light/15", border: "border-ember-light/30", icon: "text-ember-dark" },
};

const STATS = [
  { icon: CalendarCheck, value: "1,200+", label: "Events hosted" },
  { icon: MapPin, value: "40", label: "Cities covered" },
  { icon: Users, value: "85K+", label: "Happy attendees" },
  { icon: TrendingUp, value: "96%", label: "Would book again" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Discover", desc: "Browse by category, city, or search for exactly what you're after." },
  { step: "02", title: "Book", desc: "Reserve your spot in a couple of clicks — no printed tickets, no hassle." },
  { step: "03", title: "Attend", desc: "Show up and enjoy it. Your confirmation is all you need at the door." },
];

const TESTIMONIALS = [
  { name: "Priya Nair", role: "Attended 12 events", quote: "I found a ceramics workshop through EventHive that I still think about — the filters actually work, which sounds small until you've used apps where they don't." },
  { name: "Marcus Webb", role: "Music festival organizer", quote: "Listing our festival took ten minutes and we sold out the weekend tier by Thursday. The manage-events dashboard makes tracking sales painless." },
  { name: "Sofia Reyes", role: "Attended 27 events", quote: "The ticket-style cards sound like a small detail but I actually enjoy browsing instead of scrolling past everything." },
];

export default async function HomePage() {
  await connectDB();
  const featuredDocs = await Event.find({}).sort({ rating: -1 }).limit(4).lean();
  const featured = featuredDocs.map(serializeEvent);

  return (
    <>
      <Navbar />

      {/* HERO — 60-70vh, interactive search + quick category chips */}
      <section className="flex min-h-[65vh] flex-col items-center justify-center bg-stage-radial px-4 py-16 text-center text-paper sm:px-6">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-spotlight">Live events, every day</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-none tracking-wide sm:text-7xl">
          Find events worth <span className="text-spotlight">showing up</span> for
        </h1>
        <p className="mt-4 max-w-xl text-paper/70">
          Concerts, workshops, festivals and meetups — discover what&apos;s happening near you and book your spot in seconds.
        </p>
        <HeroSearch />
      </section>

      <main className="bg-paper">
        {/* CATEGORIES */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl tracking-wide text-ink">Browse by category</h2>
          <p className="mt-1 text-mist">Pick a lane, or explore all of them.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(Object.keys(CATEGORY_ICONS) as EventCategory[]).map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const style = CATEGORY_STYLES[cat];
              return (
                <Link
                  key={cat}
                  href={`/explore?category=${cat}`}
                  className={`flex flex-col items-center gap-3 rounded-card border ${style.bg} ${style.border} px-4 py-7 text-center transition-transform hover:-translate-y-0.5`}
                >
                  <Icon className={`h-7 w-7 ${style.icon}`} strokeWidth={1.75} />
                  <span className="text-sm font-semibold text-ink">{cat}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FEATURED EVENTS */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl tracking-wide text-ink">Featured this week</h2>
                <p className="mt-1 text-mist">Highest-rated events happening soon.</p>
              </div>
              <Link href="/explore" className="hidden font-medium text-ember-dark hover:underline sm:block">
                View all events →
              </Link>
            </div>

            {featured.length === 0 ? (
              <p className="mt-10 rounded-card border border-dashed border-black/10 p-10 text-center text-mist">
                No events yet — run <code className="font-mono">npm run seed</code> to load sample events.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {featured.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            )}

            <Link href="/explore" className="mt-8 block text-center font-medium text-ember-dark hover:underline sm:hidden">
              View all events →
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl tracking-wide text-ink">How EventHive works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
                <span className="font-mono text-sm text-spotlight-dark">{item.step}</span>
                <h3 className="mt-2 font-display text-2xl tracking-wide text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-mist">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="bg-stage py-16 text-paper">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto h-7 w-7 text-spotlight" />
                <p className="mt-3 font-display text-4xl tracking-wide">{s.value}</p>
                <p className="mt-1 text-sm text-paper/70">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl tracking-wide text-ink">What attendees say</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col rounded-card border border-black/5 bg-white p-6 shadow-sm">
                <p className="flex-1 text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-spotlight/20 font-display text-lg text-spotlight-dark">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-mist">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-3xl tracking-wide text-ink">Frequently asked questions</h2>
            <div className="mt-10">
              <FAQAccordion />
            </div>
          </div>
        </section>

        {/* NEWSLETTER / CTA */}
        <section className="bg-stage-radial px-4 py-16 text-paper sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="font-display text-3xl tracking-wide sm:text-4xl">Get the best events, weekly</h2>
            <p className="mt-2 max-w-lg text-paper/70">
              One email a week with hand-picked events near you. No spam, unsubscribe anytime.
            </p>
            <div className="mt-6 flex justify-center">
              <NewsletterForm />
            </div>
            <p className="mt-8 text-sm text-paper/60">
              Have an event to share?{" "}
              <Link href="/register" className="font-semibold text-spotlight hover:underline">
                Create a free account and list it
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
