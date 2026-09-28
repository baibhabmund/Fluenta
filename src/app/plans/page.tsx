import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, MessageCircle } from "lucide-react";
import { Container, LinkButton, Section } from "@/components/ui";
import { services, allFeatures, formatINR } from "@/data/services";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description: "Compare FluentX plans and prices.",
  openGraph: { title: "Plans & Pricing", description: "Compare FluentX plans and prices." },
};

const PREVIEW = 6;

export default function Plans() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-400/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl" />

        <Container className="relative py-16 sm:py-24">
          <p className="mb-4 w-fit rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 backdrop-blur dark:border-brand-800 dark:bg-slate-900/80 dark:text-brand-200">
            Prices in INR
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Plans &amp;{" "}
            <span className="bg-gradient-to-r from-brand-500 via-brand-700 to-brand-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Every plan shows what is included and its price up front. Book a free consultation if you&apos;d like help choosing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#compare" variant="outline">Compare plans</LinkButton>
            <LinkButton href="/consultation" className="group/cta">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* PLAN CARDS */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const f = allFeatures(s);
            return (
              <article
                key={s.slug}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/20 focus-within:border-brand-400 motion-safe:hover:-translate-y-1.5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-600"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 group-hover:scale-x-100"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-400/0 blur-3xl transition duration-500 group-hover:bg-brand-400/25"
                />

                <div className="relative flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white shadow-md transition duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110"
                  >
                    {s.name.charAt(0)}
                  </span>
                  <h2 className="text-xl font-extrabold leading-tight text-slate-950 dark:text-white">{s.name}</h2>
                </div>

                <p className="relative mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-brand-700 dark:text-brand-300">
                    {formatINR(s.price)}
                  </span>
                </p>

                <div className="relative mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                  {f.length > 0 ? (
                    <>
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        What&apos;s included
                      </p>
                      <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
                        {f.slice(0, PREVIEW).map((x) => (
                          <li key={x} className="flex gap-2.5">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200">
                              <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                            </span>
                            {x}
                          </li>
                        ))}
                        {f.length > PREVIEW && (
                          <li className="pl-7 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            + {f.length - PREVIEW} more included
                          </li>
                        )}
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {s.short} Full inclusions are shared during your free consultation.
                    </p>
                  )}
                </div>

                <div className="relative mt-auto flex flex-col gap-2 pt-7">
                  <LinkButton href={`/enroll/${s.slug}`} className="group/cta">
                    Enroll Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
                  </LinkButton>
                  <div className="grid grid-cols-2 gap-2">
                    <LinkButton href={`/services/${s.slug}`} variant="outline" className="!px-3">
                      Details
                    </LinkButton>
                    <LinkButton href={`/consultation?service=${s.slug}`} variant="soft" className="!px-3">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Free demo
                    </LinkButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* COMPARISON */}
      <div id="compare" className="scroll-mt-20">
        <Section
          tone="tint"
          eyebrow="Compare"
          title="Compare plans"
          intro="A side-by-side view of every plan. Swipe sideways on small screens."
        >
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Plan comparison</caption>
              <thead>
                <tr className="bg-brand-50 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  <th scope="col" className="p-4 font-extrabold">Plan</th>
                  <th scope="col" className="p-4 font-extrabold">Price</th>
                  <th scope="col" className="p-4 font-extrabold">Included items</th>
                  <th scope="col" className="p-4 text-right font-extrabold">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const count = allFeatures(s).length;
                  return (
                    <tr
                      key={s.slug}
                      className="border-t border-slate-200 transition-colors hover:bg-brand-50/60 dark:border-slate-800 dark:hover:bg-slate-800/60"
                    >
                      <th scope="row" className="p-4 font-bold text-slate-950 dark:text-white">
                        <Link
                          href={`/services/${s.slug}`}
                          className="hover:text-brand-700 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 dark:hover:text-brand-300"
                        >
                          {s.name}
                        </Link>
                      </th>
                      <td className="p-4 font-extrabold text-brand-700 dark:text-brand-300">{formatINR(s.price)}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-200">
                        {count > 0 ? `${count} items` : "Shared in consultation"}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/enroll/${s.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-brand-700 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 dark:text-brand-300"
                        >
                          Enroll <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <Container className="relative flex flex-col gap-6 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black tracking-tight text-white">Not sure which plan to pick?</h2>
            <p className="mt-3 text-base leading-7 text-white/85">
              Talk to us first. We&apos;ll reply within 24 hours with a meeting link.
            </p>
          </div>
          <LinkButton
            href="/consultation"
            className="group/cta !bg-white !px-7 !py-3.5 !text-brand-800 shadow-xl shadow-black/20 hover:!bg-brand-50"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Schedule Free Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
          </LinkButton>
        </Container>
      </section>
    </>
  );
}