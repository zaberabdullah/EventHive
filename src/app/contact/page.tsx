"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) nextErrors.message = "Message must be at least 10 characters.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="bg-paper px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl tracking-wide text-ink">Get in touch</h1>
            <p className="mt-2 text-mist">
              Questions about an event, a booking, or hosting your own? We usually reply within a business day.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-spotlight-dark" />
                <div>
                  <p className="font-medium text-ink">Email</p>
                  <a href="mailto:hello@eventhive.app" className="text-sm text-mist hover:text-ember-dark">hello@eventhive.app</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-spotlight-dark" />
                <div>
                  <p className="font-medium text-ink">Phone</p>
                  <a href="tel:+8808005550142" className="text-sm text-mist hover:text-ember-dark">+88 0 800 555 0142</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-spotlight-dark" />
                <div>
                  <p className="font-medium text-ink">Office</p>
                  <p className="text-sm text-mist">142 Old Jashore Road, Khulna, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <p className="font-display text-2xl text-ink">Message sent</p>
                <p className="mt-2 text-sm text-mist">Thanks for reaching out — we&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Name</label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Email</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Message</label>
                  <textarea className="input-field min-h-[120px]" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                  {errors.message && <p className="field-error">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary w-full">Send message</button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
