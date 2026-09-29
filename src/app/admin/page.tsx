import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/data/services";
import { formatDateTime } from "@/lib/admin";

export default async function AdminOverview() {
  const [users, paymentAgg, freeGrants, contacts, recentPayments, recentContacts] = await Promise.all([
    prisma.user.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.enrollment.count({ where: { source: "ADMIN_GRANT" } }),
    prisma.contactRequest.count(),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Users", value: users.toLocaleString("en-IN") },
    { label: "Payments", value: paymentAgg._count.toLocaleString("en-IN") },
    { label: "Revenue", value: formatINR(paymentAgg._sum.amount ?? 0) },
    { label: "Free grants", value: freeGrants.toLocaleString("en-IN") },
    { label: "Contact requests", value: contacts.toLocaleString("en-IN") },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Latest payments</h2>
            <Link href="/admin/payments" className="text-sm font-bold text-brand-700 dark:text-brand-300">View all</Link>
          </div>
          <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
            {recentPayments.length === 0 && <li className="p-4 text-sm text-slate-500">No payments recorded yet.</li>}
            {recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="truncate text-slate-500">{p.serviceName} · {formatDateTime(p.createdAt)}</p>
                </div>
                <span className="shrink-0 font-extrabold text-brand-700 dark:text-brand-300">{formatINR(p.amount)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Latest contact requests</h2>
            <Link href="/admin/contacts" className="text-sm font-bold text-brand-700 dark:text-brand-300">View all</Link>
          </div>
          <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
            {recentContacts.length === 0 && <li className="p-4 text-sm text-slate-500">No requests recorded yet.</li>}
            {recentContacts.map((c) => (
              <li key={c.id} className="p-4 text-sm">
                <p className="font-bold text-slate-900 dark:text-white">{c.name} <span className="font-normal text-slate-500">· {c.serviceName}</span></p>
                <p className="truncate text-slate-500">{c.email} · {formatDateTime(c.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
