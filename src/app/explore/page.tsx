"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { EVENT_CATEGORIES } from "@/types";
import type { EventItem } from "@/types";

const SORT_OPTIONS = [
  { value: "date_asc", label: "Date: Soonest first" },
  { value: "date_desc", label: "Date: Latest first" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "rating_desc", label: "Rating: Highest first" },
];

const CITIES = ["Austin", "New York", "Los Angeles", "Chicago", "Miami", "Seattle"];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "date_asc");
  const [page, setPage] = useState(1);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, city, maxPrice, sort]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (category !== "All") params.set("category", category);
      if (city) params.set("city", city);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "8");

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data.events);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError("Couldn't load events right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, category, city, maxPrice, sort, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Keep the URL shareable/bookmarkable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category !== "All") params.set("category", category);
    if (city) params.set("city", city);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort !== "date_asc") params.set("sort", sort);
    router.replace(`/explore${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, city, maxPrice, sort]);

  const resultLabel = useMemo(() => {
    if (loading) return "Searching…";
    return `${total} event${total === 1 ? "" : "s"} found`;
  }, [loading, total]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setCity("");
    setMaxPrice("");
    setSort("date_asc");
  };

  return (
    <>
      <Navbar />
      <main className="bg-paper">
        {/* Header + search */}
        <div className="bg-stage-radial px-4 py-12 text-paper sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="font-display text-4xl tracking-wide sm:text-5xl">Explore events</h1>
            <p className="mt-2 max-w-xl text-paper/70">
              Search by name or city, then narrow it down with filters.
            </p>
            <div className="mt-6 max-w-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, venues, or cities…"
                className="input-field !py-4 text-base"
                aria-label="Search events"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters sidebar */}
            <aside className="w-full shrink-0 lg:w-64">
              <div className="rounded-card border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg tracking-wide text-ink">Filters</h2>
                  <button onClick={clearFilters} className="text-xs font-medium text-ember-dark hover:underline">
                    Clear all
                  </button>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-ink">Category</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCategory("All")} className={`category-chip ${category === "All" ? "category-chip-active" : ""}`}>
                      All
                    </button>
                    {EVENT_CATEGORIES.map((c) => (
                      <button key={c} onClick={() => setCategory(c)} className={`category-chip ${category === c ? "category-chip-active" : ""}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold text-ink">City</label>
                  <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="input-field">
                    <option value="">All cities</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <label htmlFor="maxPrice" className="mb-2 block text-sm font-semibold text-ink">
                    Max price {maxPrice && `— $${maxPrice}`}
                  </label>
                  <input
                    id="maxPrice"
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={maxPrice || 300}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full accent-spotlight"
                  />
                  <div className="flex justify-between text-xs text-mist">
                    <span>$0</span>
                    <span>$300+</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-mist">{resultLabel}</p>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !w-auto" aria-label="Sort events">
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {error && <p className="mb-4 rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember-dark">{error}</p>}

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
                </div>
              ) : events.length === 0 ? (
                <div className="rounded-card border border-dashed border-black/10 bg-white py-16 text-center">
                  <p className="font-display text-2xl text-ink">No events match those filters</p>
                  <p className="mt-2 text-sm text-mist">Try widening your search or clearing filters.</p>
                  <button onClick={clearFilters} className="btn-outline-dark mt-5 !py-2">Clear filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {events.map((event) => <EventCard key={event.id} event={event} />)}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink disabled:opacity-40"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`h-9 w-9 rounded-full text-sm font-medium ${page === i + 1 ? "bg-spotlight text-ink" : "border border-black/10 text-ink hover:border-spotlight"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  );
}
