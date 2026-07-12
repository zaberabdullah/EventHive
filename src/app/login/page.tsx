"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, flattenZodError } from "@/lib/validators";

const DEMO_USER = { email: "demo.user@eventhive.app", password: "DemoUser123" };
const DEMO_ADMIN = { email: "demo.admin@eventhive.app", password: "DemoAdmin123" };

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent, overrideEmail?: string, overridePassword?: string) => {
    e.preventDefault();
    const values = { email: overrideEmail ?? email, password: overridePassword ?? password };
    if (overrideEmail) setEmail(overrideEmail);
    if (overridePassword) setPassword(overridePassword);

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(flattenZodError(parsed.error));
      setFormError("");
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSubmitting(true);
    const result = await login(values.email, values.password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error || "Unable to log in.");
      setFieldErrors(result.fieldErrors || {});
      return;
    }
    router.push(redirectTo);
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-md rounded-card border border-black/5 bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl tracking-wide text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-mist">Log in to book events and manage your listings.</p>

        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email address</label>
            <input id="email" type="email" autoComplete="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">Password</label>
            <input id="password" type="password" autoComplete="current-password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          {formError && <p role="alert" className="rounded-lg bg-ember/10 px-3 py-2 text-sm text-ember-dark">{formError}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={(e) => submit(e as unknown as FormEvent, DEMO_USER.email, DEMO_USER.password)} className="flex-1 rounded-full border border-black/10 px-3 py-2 text-xs font-medium text-mist hover:border-spotlight hover:text-ink">
            Demo login — User
          </button>
          <button type="button" onClick={(e) => submit(e as unknown as FormEvent, DEMO_ADMIN.email, DEMO_ADMIN.password)} className="flex-1 rounded-full border border-black/10 px-3 py-2 text-xs font-medium text-mist hover:border-spotlight hover:text-ink">
            Demo login — Admin
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-mist">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-ember-dark hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  );
}
