"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-paper">
        You&apos;re on the list — watch your inbox for weekly picks.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-paper placeholder:text-paper/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-spotlight"
          aria-label="Email address"
        />
        {error && <p className="mt-1 text-sm text-ember-light">{error}</p>}
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap">
        Subscribe
      </button>
    </form>
  );
}
