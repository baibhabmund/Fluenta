import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  Mic,
  type LucideIcon,
} from "lucide-react";
import { Container, LinkButton, Section } from "@/components/ui";
import { services } from "@/data/services";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `About ${brand.name} and the services we provide.`,
  openGraph: { title: `About ${brand.name}`, description: `About ${brand.name} and the services we provide.` },
};

type Item = { number: string; title: string; description: string; icon: LucideIcon };

const approach: Item[] = [
  {
    number: "01",
    title: "Consult first",
    description: "Share your requirements and we reply with a meeting link within 24 hours.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Clear plans",
    description: "Each plan lists what is included, so there are no surprises.",
    icon: CheckCircle2,
  },
  {
    number: "03",
    title: "Practice and feedback",
    description: "Plans include practice, mock tests and evaluation, as listed on each service page.",
    icon: Mic,
  },
];

// Only facts that are true of the site itself — no performance claims.
const highlights = [
  { value: String(services.length), label: "Services offered" },
  { value: "24h", label: "Consultation reply" },
];

const cardBase =
  "group relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700 dark:hover:shadow-black/30";

function CardDecor() {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 group-hover:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-500/10 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:bg-brand-500/20"
      />
    </>
  );
}

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-400/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" />

        <Container className="relative py-16 sm:py-24">
          <p className="mb-4 w-fit rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 backdrop-blur dark:border-brand-800 dark:bg-slate-900/80 dark:text-brand-200">
            About us
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            About{" "}
            <span className="bg-gradient-to-r from-brand-500 via-brand-700 to-brand-400 bg-clip-text text-transparent">
              {brand.name}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">{brand.tagline}</p>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
              >
                <dd className="text-2xl font-black text-brand-700 dark:text-brand-300 sm:text-3xl">{h.value}</dd>
                <dt className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{h.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* WHO WE ARE */}
      <Section eyebrow="Who we are" title="Learning that starts with a conversation">
        <div className="grid items-start gap-8 lg:grid-cols-5">
          <div className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 lg:col-span-3">
            {/* EDIT: replace with your own brand story */}
            <p>
              {brand.name} helps learners prepare for English proficiency tests and build spoken English confidence.
            </p>
            <p>
              We start with a free consultation so we understand your goals before you choose a plan.
            </p>
          </div>

          <aside className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-40 to-brand-100 to-white p-6 dark:border-brand-900 dark:from-brand-950/50 dark:to-slate-900 lg:col-span-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
              <GraduationCap className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-black text-slate-950 dark:text-white">What we support</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Test preparation, spoken English, French and interview preparation — all listed with their inclusions and prices.
            </p>
          </aside>
        </div>
      </Section>

      {/* APPROACH */}
      <Section
        tone="tint"
        eyebrow="Our approach"
        title="Simple, transparent, personal"
        intro="How we work with every learner, from the first message to the first session."
      >
        <ul className="grid gap-6 md:grid-cols-3">
          {approach.map(({ number, title, description, icon: Icon }) => (
            <li key={number}>
              <article className={`${cardBase} p-7`}>
                <CardDecor />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600 dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-900/60 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="text-xs font-black tracking-[0.2em] text-slate-300 dark:text-slate-600">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      {/* SERVICES */}
      <Section eyebrow="Our services" title="What you can prepare for" intro="Choose a service to see what is included.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 motion-safe:hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white"
                >
                  {s.name.charAt(0)}
                </span>
                <span className="flex-1 font-bold leading-snug text-slate-950 dark:text-white">{s.name}</span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:text-brand-600 dark:group-hover:text-brand-300"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <Container className="relative flex flex-col gap-6 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black tracking-tight text-white">Ready to talk about your goals?</h2>
            <p className="mt-3 text-base leading-7 text-white/85">
              Book a free consultation and we&apos;ll reply within 24 hours.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <LinkButton
              href="/consultation"
              className="group/cta !bg-white !px-7 !py-3.5 !text-brand-800 shadow-xl shadow-black/20 hover:!bg-brand-50"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Schedule Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
            </LinkButton>
            <LinkButton
              href="/services"
              className="!border !border-white/40 !bg-transparent !px-7 !py-3.5 !text-white hover:!bg-white/10"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Explore Services
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}