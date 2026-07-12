import Link from "next/link";

const explore = [
  { href: "/explore", label: "All events" },
  { href: "/explore?category=Music", label: "Music" },
  { href: "/explore?category=Workshop", label: "Workshops" },
  { href: "/explore?category=Festival", label: "Festivals" },
];

const company = [
  { href: "/about", label: "About EventHive" },
  { href: "/contact", label: "Contact us" },
  { href: "/help", label: "Help & support" },
];

const legal = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

const social = [
  { href: "https://x.com", label: "X" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-stage text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl tracking-widest">
            EVENT<span className="text-spotlight">HIVE</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-paper/70">
            EventHive helps you find live music, workshops, and festivals worth
            clearing your calendar for — and helps organizers fill every seat.
          </p>
          <div className="mt-5 space-y-1 text-sm text-paper/70">
            <p><a href="mailto:hello@eventhive.app" className="hover:text-spotlight">hello@eventhive.app</a></p>
            <p><a href="tel:+8808005550142" className="hover:text-spotlight">+88 0 800 555 0142</a></p>
            <p>142 Old Jashore Road, Khulna, Bangladesh</p>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-widest text-spotlight">EXPLORE</h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/70">
            {explore.map((l) => (
              <li key={l.label}><Link href={l.href} className="hover:text-spotlight">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-widest text-spotlight">COMPANY</h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/70">
            {company.map((l) => (
              <li key={l.label}><Link href={l.href} className="hover:text-spotlight">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-widest text-spotlight">LEGAL</h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/70">
            {legal.map((l) => (
              <li key={l.label}><Link href={l.href} className="hover:text-spotlight">{l.label}</Link></li>
            ))}
          </ul>
          <h3 className="mt-6 font-display text-sm tracking-widest text-spotlight">FOLLOW</h3>
          <ul className="mt-4 flex gap-4 text-sm text-paper/70">
            {social.map((l) => (
              <li key={l.label}><a href={l.href} target="_blank" rel="noreferrer" className="hover:text-spotlight">{l.label}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} EventHive. All rights reserved.
      </div>
    </footer>
  );
}
