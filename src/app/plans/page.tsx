import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader, Section, LinkButton } from "@/components/ui";
import { services, allFeatures, formatINR } from "@/data/services";

export const metadata: Metadata = { title: "Plans & Pricing", description: "Compare FluentX plans and prices." };

export default function Plans() {
  return (
    <>
      <PageHeader title="Plans & pricing" intro="Prices in INR. Book a free consultation if you'd like help choosing." />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const f = allFeatures(s);
            return (
              <article key={s.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-extrabold">{s.name}</h2>
                <p className="mt-1 text-3xl font-extrabold text-brand-700 dark:text-brand-300">{formatINR(s.price)}</p>
                {f.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm">
                    {f.slice(0, 6).map((x) => (
                      <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{x}</li>
                    ))}
                    {f.length > 6 && <li className="text-slate-500 dark:text-slate-400">+ {f.length - 6} more</li>}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{s.short}</p>
                )}
                <div className="mt-auto flex flex-col gap-2 pt-6">
                  <LinkButton href={`/enroll/${s.slug}`}>Enroll Now</LinkButton>
                  <LinkButton href={`/consultation?service=${s.slug}`} variant="soft">Schedule Free Consultation</LinkButton>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
      <Section tone="tint" title="Compare plans">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">Plan comparison</caption>
            <thead className="bg-slate-50 dark:bg-slate-800"><tr><th scope="col" className="p-3">Plan</th><th scope="col" className="p-3">Price</th><th scope="col" className="p-3">Included items</th></tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.slug} className="border-t border-slate-200 dark:border-slate-800">
                  <th scope="row" className="p-3 font-bold">{s.name}</th>
                  <td className="p-3">{formatINR(s.price)}</td>
                  <td className="p-3">{allFeatures(s).length || "Shared in consultation"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
