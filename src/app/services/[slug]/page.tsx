import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHeader, Section, LinkButton } from "@/components/ui";
import { Faq } from "@/components/faq";
import { faqs } from "@/data/faqs";
import { getService, services, formatINR } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const s = getService((await params).slug);

  if (!s) return {};

  return {
    title: s.name,
    description: s.short,
    openGraph: {
      title: s.name,
      description: s.short,
    },
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getService((await params).slug);

  if (!s) notFound();

  return (
    <>
      {/* Hero */}
      <PageHeader title={s.name} intro={s.short} />

      {/* Main Content */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Intro Card */}
            {s.note && (
              <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/70 p-6 dark:border-brand-900/60 dark:bg-brand-950/30 sm:p-7">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-200/30 blur-2xl dark:bg-brand-700/20" />

                <div className="relative flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm dark:bg-brand-500">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                      About this service
                    </p>

                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-200 sm:text-base sm:leading-7">
                      {s.note}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className={s.note ? "mt-10" : ""}>
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                  What you get
                </p>

                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  Everything you need to move forward
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  Explore what is included in this service and how it can support
                  your learning and preparation goals.
                </p>
              </div>

              {s.featureGroups.length > 0 ? (
                <div className="space-y-7">
                  {s.featureGroups.map((g, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
                    >
                      <h3 className="mb-4 text-lg font-extrabold text-slate-950 dark:text-white">
                        {g.title ?? "What's included"}
                      </h3>

                      <ul className="grid gap-3 sm:grid-cols-2">
                        {g.items.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-3 rounded-xl bg-slate-50 px-3.5 py-3 text-sm leading-5 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </span>

                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Detailed inclusions for this service are shared during your
                    free consultation.
                  </p>
                </div>
              )}
            </div>

            {/* Trust / Support Strip */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <Clock3 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Flexible support
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Learn at a pace that works for you.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <MessageCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Expert guidance
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Get guidance when you need it.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Clear process
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Simple enrollment and next steps.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              {/* Card Header */}
              <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </p>

                  <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
                    Available
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Starting price
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-4xl font-black tracking-tight text-brand-700 dark:text-brand-300">
                    {formatINR(s.price)}
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Final details can be discussed during your consultation.
                </p>

                <div className="mt-6 space-y-3">
                  <LinkButton
                    href={`/enroll/${s.slug}`}
                    className="w-full !py-3.5"
                  >
                    Enroll Now
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>

                  <LinkButton
                    href={`/consultation?service=${s.slug}`}
                    variant="soft"
                    className="w-full !py-3.5"
                  >
                    Schedule Free Consultation
                  </LinkButton>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                      <MessageCircle className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Not sure which option is right for you?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Talk to us first. The consultation is free and there is
                        no obligation to enroll.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      
    {/* FAQ */}
    <Section tone="tint">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 px-5 py-10 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40 sm:px-8 sm:py-12 lg:px-12">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-700/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-brand-100/40 blur-3xl dark:bg-brand-900/10"
        />

        <div className="relative">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-brand-500"
              />
              Got questions?
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Everything you need to know before getting started. If you still
              have questions, we&apos;re happy to help.
            </p>
          </div>

          {/* FAQ List */}
          <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
            <Faq items={faqs} />
          </div>

          {/* Bottom CTA */}
          <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/70 p-5 dark:border-brand-900/60 dark:bg-brand-950/30 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-950 dark:text-white">
                  Still have a question?
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  Talk to us and get personalised guidance before you enroll.
                </p>
              </div>

              <LinkButton
                href={`/consultation?service=${s.slug}`}
                variant="soft"
                className="shrink-0 !rounded-xl !px-4 !py-2.5 text-sm"
              >
                Talk to an expert
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </Section>

    </>
  );
}
