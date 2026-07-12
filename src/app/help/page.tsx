import Link from "next/link";
import { LifeBuoy, Ticket, CalendarPlus, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";

const TOPICS = [
  { icon: Ticket, title: "Booking & tickets", desc: "How to book, cancel, or find your confirmation." },
  { icon: CalendarPlus, title: "Hosting events", desc: "Listing, editing, and managing your own events." },
  { icon: ShieldCheck, title: "Account & security", desc: "Password resets, login issues, and privacy." },
  { icon: LifeBuoy, title: "Something else", desc: "Can't find what you need — reach out directly." },
];

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <section className="bg-stage-radial px-4 py-16 text-center text-paper sm:px-6">
          <h1 className="font-display text-5xl tracking-wide">How can we help?</h1>
          <p className="mt-3 text-paper/70">Browse common topics below, or check the FAQ further down.</p>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <div key={t.title} className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
                <t.icon className="h-7 w-7 text-spotlight-dark" />
                <h3 className="mt-3 font-display text-xl tracking-wide text-ink">{t.title}</h3>
                <p className="mt-1 text-sm text-mist">{t.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-mist">
            Still stuck?{" "}
            <Link href="/contact" className="font-semibold text-ember-dark hover:underline">Contact our team</Link>
          </p>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-center font-display text-3xl tracking-wide text-ink">Frequently asked questions</h2>
            <div className="mt-10">
              <FAQAccordion />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
