import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageHeader, Section } from "@/components/ui";
import { EnrollForm } from "@/components/enroll-form";
import { getService } from "@/data/services";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Enroll",
  robots: { index: false },
};

export default async function Enroll({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getService((await params).slug);

  if (!s) notFound();

  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/enroll/${s.slug}`)}`
    );
  }

  return (
    <>
      <PageHeader
        title={`Enroll in ${s.name}`}
        intro="Complete your enrollment details to get started with your FluentX plan."
      />

      <Section>
        <div className="relative mx-auto w-full max-w-3xl">
          {/* Soft background glow */}
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[4rem] bg-brand-100/50 blur-3xl dark:bg-brand-950/20" />

          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Service header */}
              <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-900/50">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                      <path d="M8 7h8" />
                      <path d="M8 11h6" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Selected service
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                      {s.name}
                    </h2>
                  </div>
                </div>

                <div className="w-fit rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Plan price
                  </p>

                  <p className="mt-0.5 text-lg font-extrabold text-slate-950 dark:text-white">
                    ₹{s.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Logged-in user */}
              <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                    {(session.user.name?.[0] ?? session.user.email?.[0] ?? "U")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Signed in as
                    </p>

                    <p className="mt-0.5 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                      {session.user.name || session.user.email}
                    </p>
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Signed in
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <div className="mb-5">
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
                    Enrollment details
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Review your information and complete the enrollment process
                    securely.
                  </p>
                </div>

                <EnrollForm
                  slug={s.slug}
                  name={s.name}
                  price={s.price}
                  userName={session.user.name ?? ""}
                  userEmail={session.user.email ?? ""}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
} 