import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Plus,
  ShieldCheck,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Container, LinkButton, Section } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
import { FluentXBanner } from "@/components/fluentx-banner";
import { HomeAmbientBackground } from "@/components/home-ambient-background";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

type Item = { number: string; title: string; description: string; icon: LucideIcon };

const whyFluentX: Item[] = [
  {
    number: "01",
    title: "Clear plans",
    description:
      "Know exactly what you're getting. Every service clearly shows its inclusions, pricing, and available support.",
    icon: CheckCircle2,
  },
  {
    number: "02",
    title: "Talk before you enroll",
    description:
      "Not sure which service is right for you? Discuss your goals and requirements with us before making a decision.",
    icon: MessageCircle,
  },
  {
    number: "03",
    title: "Simple enrollment",
    description:
      "Choose your service, provide your details, and complete your payment securely without a complicated registration process.",
    icon: ShieldCheck,
  },
];

const steps: Item[] = [
  {
    number: "01",
    title: "Explore",
    description: "Browse our preparation services and find the option that matches your goals.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Consult",
    description: "Talk to us about your requirements and get guidance before you enroll.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Enroll",
    description: "Choose your service, provide your details, and complete your registration.",
    icon: UserPlus,
  },
  {
    number: "04",
    title: "Get started",
    description: "Complete your secure payment and begin your preparation journey.",
    icon: CreditCard,
  },
];

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const cardBase =
  "group relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700 dark:hover:shadow-black/30";

const iconBox =
  "grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600 motion-safe:group-hover:scale-105 dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-900/60 dark:group-hover:bg-brand-500 dark:group-hover:text-white";

const sectionBackgroundMask: React.CSSProperties = {
  maskImage:
    "linear-gradient(to bottom, transparent, black 4rem, black calc(100% - 4rem), transparent)",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent, black 4rem, black calc(100% - 4rem), transparent)",
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

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

function ArrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
        aria-hidden="true"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function ServicesSection() {
  return (
    <Section
      eyebrow="Services"
      title="What we offer"
      intro="Explore preparation and consultation services designed around your goals."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      <div className="mt-10 flex justify-center sm:justify-start">
        <LinkButton href="/services" variant="soft" className="group/cta">
          <ArrowLabel>See all services</ArrowLabel>
        </LinkButton>
      </div>
    </Section>
  );
}

function WhySection() {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-brand-50/60 dark:bg-slate-900/40"
        style={sectionBackgroundMask}
      />
      <div className="relative z-10">
        <Section
          eyebrow="Why FluentX"
          title="Built around your learning journey"
          intro="A simple, transparent approach to help you choose the right preparation path and get started with confidence."
        >
          <ul className="grid gap-6 md:grid-cols-3">
            {whyFluentX.map(({ number, title, description, icon: Icon }) => (
              <li key={number}>
                <article className={`${cardBase} p-7`}>
                  <CardDecor />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className={iconBox}>
                        <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-black tracking-[0.2em] text-slate-300 dark:text-slate-600">
                        {number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {description}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function ProcessSection() {
  return (
    <Section
      eyebrow="Process"
      title="From your goal to your next step"
      intro="A simple four-step process designed to help you choose the right preparation path and get started without unnecessary complexity."
    >
      <div className="relative">
        {/* Desktop connector line */}
        <div
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-[3.25rem] hidden h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 lg:block dark:from-brand-900 dark:via-brand-600 dark:to-brand-900"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }, index) => (
            <li key={number}>
              <div className={`${cardBase} p-6 sm:p-7`}>
                <CardDecor />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-all duration-300 group-hover:bg-brand-500 motion-safe:group-hover:scale-110">
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-3xl font-black tracking-tighter text-slate-200 dark:text-slate-700"
                    >
                      {number}
                    </span>
                  </div>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1.5 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Inline prompt */}
      <div className="mt-10 rounded-3xl border border-brand-100 bg-gradient-to-r from-slate-50 via-white to-brand-50 p-5 dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-brand-950/70 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-950 dark:text-white">Not sure where to start?</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Talk to us and we&apos;ll help you understand the available options.
            </p>
          </div>
          <LinkButton href="/consultation" className="group/cta w-full sm:w-auto">
            <ArrowLabel>Book Free Consultation</ArrowLabel>
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}

function FaqSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-brand-950/30"
        style={sectionBackgroundMask}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 z-0 h-80 w-80 rounded-full bg-brand-400/15 blur-3xl"
      />

      <Container className="relative z-10 grid gap-10 py-14 sm:py-20 lg:grid-cols-5 lg:gap-14">
        {/* Left: heading + help card */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 w-fit rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 dark:border-brand-800 dark:bg-slate-900 dark:text-brand-200">
            FAQ
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Quick answers to common questions about our services and enrollment process.
          </p>

          <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm dark:border-brand-900 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-bold text-slate-950 dark:text-white">Still have questions?</p>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Book a free consultation and we&apos;ll reply within 24 hours.
            </p>
            <LinkButton href="/consultation" className="mt-4 w-full">
              Schedule Free Consultation
            </LinkButton>
          </div>
        </div>

        {/* Right: accordion */}
        <div className="space-y-4 lg:col-span-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-brand-300 hover:shadow-md open:border-brand-400 open:shadow-lg open:shadow-brand-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700 dark:open:border-brand-600"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl p-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 [&::-webkit-details-marker]:hidden">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-700 transition group-open:bg-brand-600 group-open:text-white dark:bg-brand-900/50 dark:text-brand-200 dark:group-open:bg-brand-600 dark:group-open:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-bold leading-snug text-slate-950 dark:text-white sm:text-lg">
                  {f.q}
                </span>
                <Plus
                  className="h-5 w-5 shrink-0 text-brand-700 transition-transform duration-300 group-open:rotate-45 dark:text-brand-300"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-5 pl-12 pr-5 text-sm leading-relaxed text-slate-600 motion-safe:animate-[fadeIn_.3s_ease-out] dark:text-slate-300 sm:pl-[4.25rem] sm:pr-6 sm:text-base">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <Container className="relative flex flex-col gap-8 py-14 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-300 motion-safe:animate-pulse" aria-hidden="true" />
            Ready when you are
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
            Not sure which plan is right for you?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
            Speak with us first, understand your options, and choose the preparation path that fits your goals.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
            <li>✓ Free consultation</li>
            <li>✓ Reply within 24 hours</li>
            <li>✓ No account needed</li>
          </ul>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
          <LinkButton
            href="/consultation"
            className="group/cta !bg-white !px-7 !py-3.5 !text-brand-800 shadow-xl shadow-black/20 hover:!bg-brand-50 motion-safe:hover:-translate-y-0.5"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            <ArrowLabel>Schedule Free Consultation</ArrowLabel>
          </LinkButton>
          <LinkButton
            href="/plans"
            className="!border !border-white/40 !bg-transparent !px-7 !py-3.5 !text-white hover:!bg-white/10"
          >
            View Plans &amp; Pricing
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <HomeAmbientBackground />
      <FluentXBanner />

      <div className="relative z-10">
        <ServicesSection />
        <WhySection />
        <ProcessSection />
        <FaqSection />
        <FinalCta />
      </div>
    </div>
  );
}