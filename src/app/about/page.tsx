import type { Metadata } from "next";
import { PageHeader, Section, LinkButton } from "@/components/ui";
import { services } from "@/data/services";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "About", description: `About ${brand.name} and the services we provide.` };

export default function About() {
  return (
    <>
      <PageHeader title={`About ${brand.name}`} intro={brand.tagline} />
      <Section title="Who we are">
        {/* EDIT: replace with your own brand story */}
        <p className="max-w-3xl text-slate-700 dark:text-slate-200">
          {brand.name} helps learners prepare for English proficiency tests and build spoken English confidence. We start with a free consultation so we understand your goals before you choose a plan.
        </p>
      </Section>
      <Section tone="tint" title="Our approach">
        <ul className="grid max-w-4xl gap-6 sm:grid-cols-3">
          <li><h3 className="font-bold">Consult first</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Share your requirements and we reply with a meeting link within 24 hours.</p></li>
          <li><h3 className="font-bold">Clear plans</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Each plan lists what is included, so there are no surprises.</p></li>
          <li><h3 className="font-bold">Practice and feedback</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Plans include practice, mock tests and evaluation, as listed on each service page.</p></li>
        </ul>
      </Section>
      <Section title="Our services">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <li key={s.slug}><a className="font-semibold text-brand-700 hover:underline dark:text-brand-300" href={`/services/${s.slug}`}>{s.name}</a></li>)}
        </ul>
        <div className="mt-8"><LinkButton href="/consultation">Schedule Free Consultation</LinkButton></div>
      </Section>
    </>
  );
}
