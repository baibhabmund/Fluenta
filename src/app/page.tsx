import { Container, LinkButton, Section } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
import { Faq } from "@/components/faq";
import { FluentXBanner } from "@/components/fluentx-banner";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import { brand } from "@/lib/brand";

const steps = [
  { t: "Explore", d: "Browse services and plans to see what is included." },
  { t: "Book a free consultation", d: "Send us your requirements. We reply within 24 hours with a meeting link." },
  { t: "Enroll", d: "Pick your plan and register with your name, email and phone." },
  { t: "Pay securely", d: "Complete payment through Razorpay and get your confirmation." },
];

export default function Home() {
  return (
    <>
      <FluentXBanner />

      <Section eyebrow="Services" title="What we offer" intro="Each plan lists exactly what is included and its price.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
        <div className="mt-8"><LinkButton href="/services" variant="soft">See all services</LinkButton></div>
      </Section>

      <Section tone="tint" eyebrow="Why FluentX" title="Simple, transparent, personal">
        <ul className="grid gap-6 sm:grid-cols-3">
          <li><h3 className="font-bold">Clear plans</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Every plan shows what is included and the price up front.</p></li>
          <li><h3 className="font-bold">Talk first</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">A free consultation lets you ask questions before you enroll.</p></li>
          <li><h3 className="font-bold">No account needed</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Enroll as a guest and pay securely through Razorpay.</p></li>
        </ul>
      </Section>

      <Section eyebrow="Process" title="How it works">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-3 font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="tint" eyebrow="FAQ" title="Frequently asked questions"><Faq items={faqs} /></Section>

      <section className="bg-brand-700 text-white">
        <Container className="flex flex-col items-start justify-between gap-4 py-12 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-extrabold text-white">Not sure which plan is right? Talk to us first.</h2>
          <LinkButton href="/consultation" className="!bg-white !text-brand-800 hover:!bg-brand-50">Schedule Free Consultation</LinkButton>
        </Container>
      </section>
    </>
  );
}
