import { prisma } from "@/lib/prisma";
import { services } from "@/data/services";
import { formatDateTime } from "@/lib/admin";
import { grantAccess, revokeAccess } from "../actions";
import { SearchBar, Th, Td, tableWrap } from "../ui";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-brand-900/40";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; msg?: string; error?: string }>;
}) {
  const { q: rawQ, msg, error } = await searchParams;
  const q = (rawQ ?? "").trim();

  const [grants, users] = await Promise.all([
    prisma.enrollment.findMany({
      where: { source: "ADMIN_GRANT" },
      include: { user: true, course: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.user.findMany({
      where: q
        ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] }
        : {},
      include: { enrollments: { include: { course: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="space-y-10">
      {msg && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{msg}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      <section>
        <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Give free access</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">The user must have signed in with Google at least once. Access appears in their dashboard immediately; no payment or email is triggered.</p>
        <form action={grantAccess} className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto] dark:border-slate-800 dark:bg-slate-950">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            User email
            <input name="email" type="email" required list="user-emails" placeholder="student@example.com" className={`${field} mt-1 normal-case tracking-normal`} />
            <datalist id="user-emails">
              {users.map((u) => u.email && <option key={u.id} value={u.email}>{u.name ?? ""}</option>)}
            </datalist>
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Service
            <select name="service" required defaultValue="" className={`${field} mt-1 normal-case tracking-normal`}>
              <option value="" disabled>Select a service…</option>
              {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </label>
          <button type="submit" className="self-end rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">Grant access</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Admin-granted access</h2>
        <div className={tableWrap}>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900"><tr><Th>Granted</Th><Th>User</Th><Th>Service</Th><Th>By</Th><Th>Action</Th></tr></thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {grants.length === 0 && <tr><Td colSpan={5}>No free access granted yet.</Td></tr>}
              {grants.map((g) => (
                <tr key={g.id}>
                  <Td className="whitespace-nowrap">{formatDateTime(g.createdAt)}</Td>
                  <Td><p className="font-bold text-slate-900 dark:text-white">{g.user.name ?? "—"}</p><p className="text-slate-500">{g.user.email}</p></Td>
                  <Td>{g.course.title}</Td>
                  <Td>{g.grantedBy ?? "—"}</Td>
                  <Td>
                    <form action={revokeAccess}>
                      <input type="hidden" name="enrollmentId" value={g.id} />
                      <button type="submit" className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">Revoke</button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Users</h2>
          <SearchBar q={q} placeholder="Search name or email…" />
        </div>
        <div className={tableWrap}>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900"><tr><Th>Joined</Th><Th>User</Th><Th>Services</Th></tr></thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.length === 0 && <tr><Td colSpan={3}>No users found.</Td></tr>}
              {users.map((u) => (
                <tr key={u.id}>
                  <Td className="whitespace-nowrap">{formatDateTime(u.createdAt)}</Td>
                  <Td><p className="font-bold text-slate-900 dark:text-white">{u.name ?? "—"}</p><p className="text-slate-500">{u.email}</p></Td>
                  <Td>
                    {u.enrollments.length === 0 ? "—" : (
                      <div className="flex flex-wrap gap-1.5">
                        {u.enrollments.map((e) => (
                          <span key={e.id} className={`rounded-full px-2.5 py-1 text-xs font-bold ${e.source === "ADMIN_GRANT" ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>
                            {e.course.title} · {e.source === "ADMIN_GRANT" ? "Free" : "Paid"}
                          </span>
                        ))}
                      </div>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
