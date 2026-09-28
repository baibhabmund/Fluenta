import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, MessageCircle } from "lucide-react";
import { Container, LinkButton, Section } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "IELTS, PTE, Duolingo, CELPIP, Spoken English, French and interview preparation.",
  openGraph: {
    title: "Services",
    description: "IELTS, PTE, Duolingo, CELPIP, Spoken English, French and interview preparation.",
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-400/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" />

        <Container className="relative py-16 sm:py-24">
          <p className="mb-4 w-fit rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 backdrop-blur dark:border-brand-800 dark:bg-slate-900/80 dark:text-brand-200">
            {services.length} services
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Our{" "}
            <span className="bg-gradient-to-r from-brand-500 via-brand-700 to-brand-400 bg-clip-text text-transparent">
              services
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Choose a service to see what is included, or book a free consultation.
          </p>

          {/* quick jump chips */}
          <nav aria-label="Jump to a service" className="mt-8 flex flex-wrap gap-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur transition duration-300 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 motion-safe:hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-brand-600 dark:hover:bg-brand-950/50 dark:hover:text-brand-100"
              >
                {s.name}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      {/* GRID */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} showFeatures={5} />
          ))}
        </div>

        {/* help strip */}
        <div className="mt-12 rounded-3xl border border-brand-100 bg-gradient-to-r from-slate-50 via-white to-brand-50 p-6 dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-brand-950/70 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <MessageCircle className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">Not sure which service fits you?</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Tell us your goals and we&apos;ll reply within 24 hours with a meeting link.
                </p>
              </div>
            </div>
            <LinkButton href="/consultation" className="group/cta w-full shrink-0 sm:w-auto">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Schedule Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}