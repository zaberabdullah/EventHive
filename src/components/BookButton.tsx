"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function BookButton({ eventId, initialSeatsLeft, price }: { eventId: string; initialSeatsLeft: number; price: number }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [seatsLeft, setSeatsLeft] = useState(initialSeatsLeft);
  const [status, setStatus] = useState<"idle" | "booking" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    setStatus("booking");
    setError("");
    try {
      const res = await fetch(`/api/events/${eventId}/book`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not complete booking.");
        setStatus("error");
        return;
      }
      setSeatsLeft(data.seatsLeft);
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (seatsLeft === 0 && status !== "done") {
    return <button disabled className="btn-primary w-full opacity-50">Sold out</button>;
  }

  if (status === "done") {
    return (
      <div className="rounded-lg bg-spotlight/15 px-4 py-3 text-center text-sm font-semibold text-spotlight-dark">
        You&apos;re booked! Check your email for confirmation.
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleBook} disabled={loading || status === "booking"} className="btn-primary w-full">
        {status === "booking" ? "Booking…" : price === 0 ? "Reserve free spot" : `Book now — $${price}`}
      </button>
      {error && <p className="mt-2 text-sm text-ember-dark">{error}</p>}
      <p className="mt-2 text-center text-xs text-mist">{seatsLeft} seats left</p>
    </div>
  );
}
