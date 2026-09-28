import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHeader, Section, LinkButton } from "@/components/ui";
import { Faq } from "@/components/faq";
import { faqs } from "@/data/faqs";
import { getService, services, formatINR } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: s.name, description: s.short, openGraph: { title: s.name, description: s.short } };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  return (
    <>
      <PageHeader title={s.name} intro={s.short} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {s.note && <p className="text-slate-700 dark:text-slate-200">{s.note}</p>}
            {s.featureGroups.length > 0 ? (
              s.featureGroups.map((g, i) => (
                <div key={i}>
                  <h2 className="mb-3 text-xl font-extrabold">{g.title ?? "What's included"}</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {g.items.map((f) => (
                      <li key={f} className="flex gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-300">Detailed inclusions for this service are shared during your free consultation.</p>
            )}
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Plan price</p>
            <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-300">{formatINR(s.price)}</p>
            <div className="mt-5 flex flex-col gap-2">
              <LinkButton href={`/enroll/${s.slug}`}>Enroll Now</LinkButton>
              <LinkButton href={`/consultation?service=${s.slug}`} variant="soft">Schedule Free Consultation</LinkButton>
            </div>
          </aside>
        </div>
      </Section>
      <Section tone="tint" title="Frequently asked questions"><Faq items={faqs} /></Section>
    </>
  );
}
