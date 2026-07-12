import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-4 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-spotlight-dark">404</p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-ink">This page didn&apos;t make the guest list</h1>
        <p className="mt-2 max-w-md text-mist">The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
        <Link href="/" className="btn-outline-dark mt-6">Back to home</Link>
      </main>
      <Footer />
    </>
  );
}
