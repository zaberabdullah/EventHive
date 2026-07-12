"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do I book a ticket?",
    a: "Open any event's details page and click Book Now. You'll need to be logged in — if you're not, we'll take you to the login page and bring you right back afterward.",
  },
  {
    q: "Can I get a refund if an event is cancelled?",
    a: "Yes. If an organizer cancels an event, you'll be notified by email and refunded to your original payment method within 5–7 business days.",
  },
  {
    q: "How do I list my own event?",
    a: "Create a free account, then go to Host an Event from the navigation bar. Fill in the details — title, description, date, venue, price and capacity — and it's live immediately.",
  },
  {
    q: "Is there a fee for organizers?",
    a: "Listing an event is free. We only take a small percentage of paid ticket sales, and free events never incur any fees.",
  },
  {
    q: "Can I edit or remove an event after publishing it?",
    a: "Yes — visit My Events from the navigation bar to view, edit, or delete any event you've listed.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-black/10 rounded-card border border-black/5 bg-white shadow-sm">
      {FAQS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-ink">{item.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-spotlight-dark transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="px-6 pb-5 text-sm leading-relaxed text-mist">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
