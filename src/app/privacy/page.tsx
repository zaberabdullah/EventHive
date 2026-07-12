import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  { title: "Information we collect", body: "When you create an account, we collect your name, email address, and a hashed version of your password — we never store passwords in plain text. When you book or list an event, we store the details you provide (event information, or booking records tied to your account)." },
  { title: "How we use your information", body: "We use your information to operate your account, process bookings, show you relevant events, and communicate important updates about events you've booked or listed. We do not sell your personal data to third parties." },
  { title: "Cookies", body: "We use a single essential cookie to keep you logged in securely. It's httpOnly, meaning it can't be read by JavaScript, and it expires automatically after 7 days of inactivity." },
  { title: "Data retention", body: "We retain account data for as long as your account is active. If you'd like your account and associated data deleted, contact us and we'll process the request within 30 days." },
  { title: "Your rights", body: "You can access, correct, or request deletion of your personal data at any time by contacting hello@eventhive.app." },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl tracking-wide text-ink">Privacy policy</h1>
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
