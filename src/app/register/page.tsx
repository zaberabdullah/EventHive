"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { registerSchema, flattenZodError } from "@/lib/validators";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setFieldErrors(flattenZodError(parsed.error));
      setFormError("");
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSubmitting(true);
    const result = await register(parsed.data.name, parsed.data.email, parsed.data.password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error || "Unable to create your account.");
      setFieldErrors(result.fieldErrors || {});
      return;
    }
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center bg-paper px-4 py-16">
        <div className="w-full max-w-md rounded-card border border-black/5 bg-white p-8 shadow-sm">
          <h1 className="font-display text-3xl tracking-wide text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-mist">Join EventHive to book and host events.</p>

          <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Full name</label>
              <input id="name" type="text" autoComplete="name" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email address</label>
              <input id="email" type="email" autoComplete="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">Password</label>
              <input id="password" type="password" autoComplete="new-password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="mt-1 text-xs text-mist">At least 8 characters, one uppercase letter, one number.</p>
              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            {formError && <p role="alert" className="rounded-lg bg-ember/10 px-3 py-2 text-sm text-ember-dark">{formError}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mist">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-ember-dark hover:underline">Log in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
