import { Check } from "lucide-react";
import { Service, allFeatures, formatINR } from "@/data/services";
import { LinkButton } from "@/components/ui";

export function ServiceCard({ service, showFeatures = 4 }: { service: Service; showFeatures?: number }) {
  const features = allFeatures(service);
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-extrabold">{service.name}</h3>
      <p className="mt-1 text-2xl font-extrabold text-brand-700 dark:text-brand-300">{formatINR(service.price)}</p>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{service.short}</p>
      {features.length > 0 && showFeatures > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {features.slice(0, showFeatures).map((f) => (
            <li key={f} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              {f}
            </li>
          ))}
          {features.length > showFeatures && (
            <li className="text-slate-500 dark:text-slate-400">+ {features.length - showFeatures} more included</li>
          )}
        </ul>
      )}
      <div className="mt-auto flex flex-col gap-2 pt-6">
        <LinkButton href={`/enroll/${service.slug}`}>Enroll Now</LinkButton>
        <LinkButton href={`/services/${service.slug}`} variant="outline">
          View details
        </LinkButton>
        <LinkButton href={`/consultation?service=${service.slug}`} variant="soft">
          Schedule Free Consultation
        </LinkButton>
      </div>
    </article>
  );
}
