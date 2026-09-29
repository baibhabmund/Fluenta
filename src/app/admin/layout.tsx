import type { Metadata } from "next";
import { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { Container } from "@/components/ui";
import { AdminTabs } from "@/components/admin-tabs";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  return (
    <Container className="pb-16 pt-28 sm:pt-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            <ShieldCheck className="h-4 w-4" /> Admin
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Admin dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Signed in as {session.user.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <AdminTabs />
      </div>
      <div className="mt-8">{children}</div>
    </Container>
  );
}
