"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Trash2, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ManageEventsChart from "@/components/ManageEventsChart";
import type { EventItem } from "@/types";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events/mine", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load your events.");
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not delete this event.");
      }
      setEvents((prev) => prev.filter((e) => e.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this event.");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const dateLabel = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-paper px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-4xl tracking-wide text-ink">My events</h1>
              <p className="mt-1 text-mist">Everything you&apos;ve listed on EventHive.</p>
            </div>
            <Link href="/items/add" className="btn-primary inline-flex items-center gap-2 !py-2.5">
              <Plus className="h-4 w-4" /> Host a new event
            </Link>
          </div>

          {error && <p className="mt-6 rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember-dark">{error}</p>}

          {loading ? (
            <div className="mt-8 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-20 w-full rounded-card" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-10 rounded-card border border-dashed border-black/10 bg-white py-16 text-center">
              <p className="font-display text-2xl text-ink">You haven&apos;t listed any events yet</p>
              <p className="mt-2 text-sm text-mist">Host your first event and it&apos;ll show up here.</p>
              <Link href="/items/add" className="btn-primary mt-5 inline-flex !py-2.5">Host an event</Link>
            </div>
          ) : (
            <>
              <div className="mt-8">
                <ManageEventsChart events={events} />
              </div>

              {/* Desktop table */}
              <div className="mt-6 hidden overflow-hidden rounded-card border border-black/5 bg-white shadow-sm md:block">
                <table className="w-full text-left">
                  <thead className="border-b border-black/5 bg-paper text-xs uppercase tracking-wide text-mist">
                    <tr>
                      <th className="px-5 py-3">Event</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Seats left</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="flex items-center gap-3 px-5 py-4">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-stage">
                            <Image src={event.image} alt={event.title} fill sizes="64px" className="object-cover" />
                          </div>
                          <span className="font-medium text-ink">{event.title}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-mist">{event.category}</td>
                        <td className="px-5 py-4 font-mono text-sm text-mist">{dateLabel(event.date)}</td>
                        <td className="px-5 py-4 font-mono text-sm text-mist">{event.price === 0 ? "Free" : `$${event.price}`}</td>
                        <td className="px-5 py-4 text-sm text-mist">{event.seatsLeft} / {event.capacity}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link href={`/events/${event.id}`} className="rounded-full border border-black/10 p-2 text-ink hover:border-spotlight" aria-label={`View ${event.title}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button onClick={() => setPendingDelete(event)} className="rounded-full border border-black/10 p-2 text-ember-dark hover:border-ember" aria-label={`Delete ${event.title}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mt-6 space-y-4 md:hidden">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-3 rounded-card border border-black/5 bg-white p-4 shadow-sm">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-stage">
                      <Image src={event.image} alt={event.title} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{event.title}</p>
                      <p className="text-xs text-mist">{event.category} · {dateLabel(event.date)}</p>
                      <p className="mt-1 font-mono text-sm text-mist">
                        {event.price === 0 ? "Free" : `$${event.price}`} · {event.seatsLeft}/{event.capacity} seats
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Link href={`/events/${event.id}`} className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ink">View</Link>
                        <button onClick={() => setPendingDelete(event)} className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ember-dark">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {pendingDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 px-4">
          <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl tracking-wide text-ink">Delete this event?</h2>
            <p className="mt-2 text-sm text-mist">
              &ldquo;{pendingDelete.title}&rdquo; will be permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setPendingDelete(null)} className="btn-outline-dark flex-1 !py-2">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 rounded-full bg-ember px-6 py-2 font-semibold text-white hover:bg-ember-dark disabled:opacity-50">
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
