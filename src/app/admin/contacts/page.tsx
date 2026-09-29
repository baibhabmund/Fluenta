import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/admin";
import { SearchBar, Th, Td, tableWrap } from "../ui";

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { phone: { contains: q } },
          { serviceName: { contains: q, mode: "insensitive" as const } },
          { message: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [requests, total] = await Promise.all([
    prisma.contactRequest.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.contactRequest.count({ where }),
  ]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Contact requests</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{total} free consultation request{total === 1 ? "" : "s"}{q && " (filtered)"}</p>
        </div>
        <SearchBar q={q} placeholder="Search name, email, message…" />
      </div>
      <p className="mt-2 text-xs text-slate-500">Requests are still emailed to you exactly as before; this is a stored copy. Only requests received after this dashboard was deployed appear here.</p>

      <div className={tableWrap}>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr><Th>Received</Th><Th>Name</Th><Th>Contact</Th><Th>Service</Th><Th>Preferred slot</Th><Th>Message</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {requests.length === 0 && <tr><Td colSpan={6}>No contact requests found.</Td></tr>}
            {requests.map((c) => (
              <tr key={c.id}>
                <Td className="whitespace-nowrap">{formatDateTime(c.createdAt)}</Td>
                <Td className="font-bold text-slate-900 dark:text-white">{c.name}</Td>
                <Td>
                  <a href={`mailto:${c.email}`} className="text-brand-700 hover:underline dark:text-brand-300">{c.email}</a>
                  <p className="whitespace-nowrap text-slate-500">{c.phone}</p>
                </Td>
                <Td>{c.serviceName}</Td>
                <Td className="whitespace-nowrap">{[c.preferredDate, c.preferredTime].filter(Boolean).join(" · ") || "—"}</Td>
                <Td className="max-w-md">
                  <details>
                    <summary className="cursor-pointer text-slate-700 dark:text-slate-300">
                      {c.message.length > 70 ? c.message.slice(0, 70) + "…" : c.message}
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-slate-600 dark:text-slate-400">{c.message}</p>
                  </details>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
