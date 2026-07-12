"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EVENT_CATEGORIES } from "@/types";
import { createEventSchema, flattenZodError } from "@/lib/validators";

const initialForm = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  category: "Music" as (typeof EVENT_CATEGORIES)[number],
  image: "",
  date: "",
  time: "",
  venue: "",
  city: "",
  price: "",
  capacity: "",
};

export default function AddEventPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = createEventSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(flattenZodError(parsed.error));
      setFormError("");
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setFormError(data.error || "Could not create the event.");
        setFieldErrors(data.fieldErrors || {});
        return;
      }

      router.push(`/events/${data.event.id}`);
    } catch {
      setSubmitting(false);
      setFormError("Network error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-paper px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl tracking-wide text-ink">Host an event</h1>
          <p className="mt-1 text-mist">Fill in the details below — your event goes live immediately after submitting.</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-card border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <Field label="Title" error={fieldErrors.title}>
              <input className="input-field" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Riverside Jazz Night" />
            </Field>

            <Field label="Short description" error={fieldErrors.shortDescription} hint="Shown on event cards — max 160 characters.">
              <input className="input-field" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="One line that sells the event" maxLength={160} />
            </Field>

            <Field label="Full description" error={fieldErrors.fullDescription} hint="Shown on the event details page.">
              <textarea className="input-field min-h-[140px]" value={form.fullDescription} onChange={(e) => update("fullDescription", e.target.value)} placeholder="Describe what attendees can expect, schedule, what's included…" />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Category" error={fieldErrors.category}>
                <select className="input-field" value={form.category} onChange={(e) => update("category", e.target.value)}>
                  {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Image URL" error={fieldErrors.image} hint="Optional — a default image is used if left blank.">
                <input className="input-field" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://…" />
              </Field>

              <Field label="Date" error={fieldErrors.date}>
                <input type="date" className="input-field" value={form.date} onChange={(e) => update("date", e.target.value)} />
              </Field>

              <Field label="Time" error={fieldErrors.time}>
                <input type="time" className="input-field" value={form.time} onChange={(e) => update("time", e.target.value)} />
              </Field>

              <Field label="Venue" error={fieldErrors.venue}>
                <input className="input-field" value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="e.g. The Parish" />
              </Field>

              <Field label="City" error={fieldErrors.city}>
                <input className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. Austin" />
              </Field>

              <Field label="Price (USD)" error={fieldErrors.price} hint="Enter 0 for a free event.">
                <input type="number" min="0" step="1" className="input-field" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" />
              </Field>

              <Field label="Capacity" error={fieldErrors.capacity}>
                <input type="number" min="1" step="1" className="input-field" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} placeholder="100" />
              </Field>
            </div>

            {formError && <p role="alert" className="rounded-lg bg-ember/10 px-3 py-2 text-sm text-ember-dark">{formError}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? "Publishing…" : "Submit event"}
              </button>
              <button type="button" onClick={() => router.push("/items/manage")} className="btn-outline-dark flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-mist">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
