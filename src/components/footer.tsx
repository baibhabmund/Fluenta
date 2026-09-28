import Link from "next/link";
import { ArrowRight, CalendarCheck, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { brand } from "@/lib/brand";
import { services } from "@/data/services";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/plans", label: "Plans & Pricing" },
  { href: "/consultation", label: "Free Consultation" },
];

const linkClass =
  "inline-block rounded text-sm text-slate-300 transition duration-200 hover:translate-x-1 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 motion-reduce:hover:translate-x-0";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white">
      <span aria-hidden="true" className="h-px w-6 bg-brand-400" />
      {children}
    </h2>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Top accent line + glows + dot pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-brand-400/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <Container className="relative">
        

        {/* Main columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-block rounded text-3xl font-black tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              {brand.name}
              <span className="text-brand-400">.</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              {brand.tagline}
            </p>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              IELTS, PTE, Duolingo, CELPIP, Spoken English, French and
              interview preparation.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <ColumnTitle>Explore</ColumnTitle>

            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link className={linkClass} href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-3">
            <ColumnTitle>Services</ColumnTitle>

            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    className={linkClass}
                    href={`/services/${s.slug}`}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <ColumnTitle>Contact</ColumnTitle>

            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${brand.contactEmail}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition duration-300 hover:border-brand-400/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 break-all text-sm font-semibold text-white">
                    {brand.contactEmail}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`tel:${brand.contactPhone}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition duration-300 hover:border-brand-400/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {brand.contactPhone}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>

          <p>Secure payments powered by Razorpay.</p>
        </div>
      </Container>
    </footer>
  );
}