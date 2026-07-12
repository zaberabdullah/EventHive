"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EVENT_CATEGORIES } from "@/types";

const QUICK_CATEGORIES = EVENT_CATEGORIES.slice(0, 4);

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="mt-8 w-full max-w-xl">
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-card bg-white p-2 shadow-lg sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, venues, or cities…"
          className="flex-1 rounded-lg border-0 bg-transparent px-4 py-3 text-ink placeholder:text-mist focus:outline-none"
          aria-label="Search events"
        />
        <button type="submit" className="btn-primary whitespace-nowrap">
          Find events
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => router.push(`/explore?category=${cat}`)}
            className="rounded-full border border-white/30 px-4 py-1.5 text-sm text-paper/90 transition-colors hover:border-spotlight hover:text-spotlight"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
