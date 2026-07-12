"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PRIVATE_LINKS = [
  { href: "/items/add", label: "Host an Event" },
  { href: "/items/manage", label: "My Events" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-stage/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl tracking-widest text-paper">
          EVENT<span className="text-spotlight">HIVE</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-spotlight ${
                pathname === link.href ? "text-spotlight" : "text-paper/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-paper/70">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-paper/80 hover:text-spotlight">
                Log in
              </Link>
              <Link href="/register" className="btn-primary !px-4 !py-2 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="h-0.5 w-6 bg-paper" />
          <span className="h-0.5 w-6 bg-paper" />
          <span className="h-0.5 w-6 bg-paper" />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-stage px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-paper/80 hover:text-spotlight">
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 border-t border-white/10 pt-3">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">
                  Log out
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary !px-4 !py-2 text-sm">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary !px-4 !py-2 text-sm">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
