import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  { title: "Accounts", body: "You must provide accurate information when creating an account. You're responsible for keeping your login credentials secure and for all activity under your account." },
  { title: "Listing events", body: "Organizers are responsible for the accuracy of their event listings, including dates, pricing, and capacity. EventHive reserves the right to remove listings that are misleading, fraudulent, or violate applicable law." },
  { title: "Bookings", body: "Booking a spot on EventHive reserves your place based on the information provided by the organizer at the time of booking. Refund and cancellation policies are set by individual organizers unless otherwise stated." },
  { title: "Acceptable use", body: "You agree not to use EventHive to post unlawful content, impersonate others, or attempt to disrupt the platform's normal operation." },
  { title: "Limitation of liability", body: "EventHive facilitates discovery and booking but is not responsible for the conduct of organizers or attendees, or for events being cancelled, rescheduled, or not meeting expectations." },
  { title: "Changes to these terms", body: "We may update these terms from time to time. Continued use of EventHive after changes are posted constitutes acceptance of the updated terms." },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl tracking-wide text-ink">Terms of service</h1>
          <p className="mt-2 text-sm text-mist">Last updated: July 2026</p>

          <div className="mt-8 space-y-8">
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-2xl tracking-wide text-ink">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-ink/80">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
