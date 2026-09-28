import Link from "next/link";
import { Container } from "@/components/ui";
import { brand } from "@/lib/brand";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="text-xl font-black text-brand-700 dark:text-brand-300">{brand.name}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{brand.tagline}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Services</p>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {services.map((s) => (
              <li key={s.slug}>
                <Link className="hover:underline" href={`/services/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Contact</p>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <li><Link className="hover:underline" href="/consultation">Free consultation</Link></li>
            <li><a className="hover:underline" href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a></li>
            <li><a className="hover:underline" href={`tel:${brand.contactPhone}`}>{brand.contactPhone}</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
