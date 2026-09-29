"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/access", label: "Free access" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/contacts", label: "Contact requests" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
