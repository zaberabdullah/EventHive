import { Target, Heart, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VALUES = [
  { icon: Target, title: "Signal over noise", desc: "Every event on EventHive is reviewed for quality — we'd rather show you 20 great options than 2,000 mediocre ones." },
  { icon: Heart, title: "Built for organizers too", desc: "Listing an event should take minutes, not hours. We keep the hosting tools simple so organizers can focus on the event itself." },
  { icon: Users, title: "Community-first", desc: "Ratings and reviews come from real attendees. We don't sell placement, and we don't hide bad reviews." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <section className="bg-stage-radial px-4 py-16 text-center text-paper sm:px-6">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-spotlight">About us</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-5xl tracking-wide">
            We built EventHive because finding a good event shouldn&apos;t take longer than attending one
          </h1>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl tracking-wide text-ink">Our story</h2>
          <p className="mt-4 leading-relaxed text-ink/80">
            EventHive started in 2023 after our founders spent a frustrating weekend trying to find a single
            decent concert across three different ticketing apps, none of which talked to each other. We
            figured discovery shouldn&apos;t be the hard part — so we built a single place to search, filter,
            and book events across categories, from intimate workshops to city-wide festivals.
          </p>
          <p className="mt-4 leading-relaxed text-ink/80">
            Today, organizers of every size — from independent artists to venues hosting hundreds of shows a
            year — use EventHive to reach new audiences, and attendees use it to stop missing out on things
            they would&apos;ve loved if they&apos;d only known about them in time.
          </p>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center font-display text-3xl tracking-wide text-ink">What we care about</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-card border border-black/5 bg-paper p-6">
                  <v.icon className="h-7 w-7 text-spotlight-dark" />
                  <h3 className="mt-3 font-display text-xl tracking-wide text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm text-mist">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
