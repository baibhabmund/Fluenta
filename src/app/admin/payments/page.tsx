import { prisma } from "@/lib/prisma";
import { formatINR } from "@/data/services";
import { formatDateTime } from "@/lib/admin";
import { SearchBar, Th, Td, tableWrap } from "../ui";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { phone: { contains: q } },
          { serviceName: { contains: q, mode: "insensitive" as const } },
          { orderId: { contains: q } },
          { paymentId: { contains: q } },
        ],
      }
    : {};
  const [payments, agg] = await Promise.all([
    prisma.payment.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.payment.aggregate({ where, _sum: { amount: true }, _count: true }),
  ]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Payments</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {agg._count} payment{agg._count === 1 ? "" : "s"} · {formatINR(agg._sum.amount ?? 0)} total{q && " (filtered)"}
          </p>
        </div>
        <SearchBar q={q} placeholder="Search name, email, payment ID…" />
      </div>
      <p className="mt-2 text-xs text-slate-500">Showing verified Razorpay payments recorded from the moment this dashboard was deployed. Earlier payments remain visible in your Razorpay dashboard.</p>

      <div className={tableWrap}>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr><Th>Date</Th><Th>Customer</Th><Th>Phone</Th><Th>Service</Th><Th>Amount</Th><Th>Order ID</Th><Th>Payment ID</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {payments.length === 0 && <tr><Td colSpan={7}>No payments found.</Td></tr>}
            {payments.map((p) => (
              <tr key={p.id}>
                <Td className="whitespace-nowrap">{formatDateTime(p.createdAt)}</Td>
                <Td><p className="font-bold text-slate-900 dark:text-white">{p.name}</p><p className="text-slate-500">{p.email}</p></Td>
                <Td className="whitespace-nowrap">{p.phone}</Td>
                <Td>{p.serviceName}</Td>
                <Td className="whitespace-nowrap font-extrabold text-brand-700 dark:text-brand-300">{formatINR(p.amount)}</Td>
                <Td className="font-mono text-xs">{p.orderId}</Td>
                <Td className="font-mono text-xs">{p.paymentId}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
