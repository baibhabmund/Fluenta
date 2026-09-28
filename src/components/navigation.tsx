"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <Container className="pointer-events-auto px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-black/20">
          
          {/* Main Navbar */}
          <div className="flex min-h-14 items-center justify-between gap-2 px-2.5 sm:min-h-16 sm:px-3">

            {/* Logo + Menu */}
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">

              {/* Logo */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="group flex min-w-0 shrink items-center gap-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-black text-white shadow-sm transition-transform group-hover:scale-105 sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm dark:bg-brand-500">
                  {brand.name.charAt(0)}
                </span>

                <span className="max-w-[140px] truncate text-base font-black tracking-tight text-slate-900 sm:max-w-none sm:text-lg dark:text-white">
                  {brand.name}
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close navigation" : "Open navigation"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:h-9 sm:w-9 sm:rounded-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 md:hidden"
              >
                {open ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav
              aria-label="Main"
              className="hidden items-center gap-0.5 md:flex lg:gap-1"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-2.5 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-950 lg:px-3.5 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

              {/* Theme */}
              <ThemeToggle />

              {/* Desktop CTA */}
              <Link
                href="/consultation"
                className={buttonClass(
                  "primary",
                  "hidden !rounded-xl !px-3 !py-2 text-xs sm:!px-4 sm:!py-2.5 sm:text-sm md:inline-flex"
                )}
              >
                <span className="hidden lg:inline">
                  Free Consultation
                </span>
                <span className="lg:hidden">
                  Consultation
                </span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {open && (
            <div
              id="mobile-menu"
              className="border-t border-slate-200/80 px-3 pb-3 pt-3 dark:border-slate-800/80 md:hidden"
            >
              <nav aria-label="Mobile">

                {/* Navigation Links */}
                <div className="space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-11 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-brand-50 hover:text-brand-700 active:scale-[0.99] dark:text-slate-200 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
                    >
                      <span>{link.label}</span>

                      <ArrowRight className="h-4 w-4 -translate-x-1 opacity-40 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <Link
                  href="/consultation"
                  onClick={() => setOpen(false)}
                  className={buttonClass(
                    "primary",
                    "mt-3 flex min-h-11 w-full !rounded-xl !py-2.5 text-sm"
                  )}
                >
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </nav>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
