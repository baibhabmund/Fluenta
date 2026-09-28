"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass, Container } from "@/components/ui";
import { brand } from "@/lib/brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/plans", label: "Plans & Pricing" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black tracking-tight text-brand-700 dark:text-brand-300">
          {brand.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-semibold hover:text-brand-700 dark:hover:text-brand-300">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/consultation" className={buttonClass("primary", "hidden !py-2 md:inline-flex")}>
            Free Consultation
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 md:hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/consultation" onClick={() => setOpen(false)} className={buttonClass("primary", "mt-3 w-full")}>
            Schedule Free Consultation
          </Link>
        </nav>
      )}
    </header>
  );
}
