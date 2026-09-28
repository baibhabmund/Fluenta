import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Service, allFeatures, formatINR } from "@/data/services";
import { LinkButton } from "@/components/ui";

export function ServiceCard({ service, showFeatures = 4 }: { service: Service; showFeatures?: number }) {
  const features = allFeatures(service);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 motion-safe:hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/20 focus-within:border-brand-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-600">
      {/* animated top accent bar */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 transition-transform duration-500 group-hover:scale-x-100"
      />
      {/* soft glow blob */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-400/0 blur-3xl transition duration-500 group-hover:bg-brand-400/25"
      />
      {/* light sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 hidden w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 motion-safe:group-hover:translate-x-[450%] dark:via-white/10 motion-safe:block"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white shadow-md transition duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110"
          >
            {service.name.charAt(0)}
          </span>
          <h3 className="text-xl font-extrabold leading-tight">{service.name}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-extrabold text-brand-800 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-100">
          {formatINR(service.price)}
        </span>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{service.short}</p>

      {features.length > 0 && showFeatures > 0 && (
        <ul className="relative mt-5 space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
          {features.slice(0, showFeatures).map((f, i) => (
            <li
              key={f}
              className="flex gap-2.5 transition duration-300 motion-safe:group-hover:translate-x-1"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200">
                <Check className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
          {features.length > showFeatures && (
            <li className="pl-7 text-xs font-semibold text-slate-500 dark:text-slate-400">
              + {features.length - showFeatures} more included
            </li>
          )}
        </ul>
      )}

      <div className="relative mt-auto flex flex-col gap-2 pt-7">
        <LinkButton href={`/enroll/${service.slug}`} className="group/cta">
          Enroll Now
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
        </LinkButton>
        <div className="grid grid-cols-2 gap-2">
          <LinkButton href={`/services/${service.slug}`} variant="outline" className="!px-3">
            Details
          </LinkButton>
          <LinkButton href={`/consultation?service=${service.slug}`} variant="soft" className="!px-3">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Free demo
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
