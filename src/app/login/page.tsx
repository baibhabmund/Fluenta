import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

const isSafeCallback = (value?: string) =>
  Boolean(value?.startsWith("/") && !value.startsWith("//"));

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(isSafeCallback(callbackUrl) ? callbackUrl! : "/dashboard");
  }

  const destination = isSafeCallback(callbackUrl)
    ? callbackUrl!
    : "/dashboard";

  return (
    <>
      <PageHeader
        title="Welcome back"
        intro="Sign in to continue your FluentX learning experience."
      />

      <Section>
        <div className="relative mx-auto w-full max-w-md">
          {/* Soft background glow */}
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[4rem] bg-brand-100/50 blur-3xl dark:bg-brand-950/20" />

          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

            <div className="p-7 sm:p-9">
              {/* Login icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 dark:bg-brand-950/50 dark:ring-brand-900/50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-brand-600 dark:text-brand-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="m10 17 5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
              </div>

              {/* Heading */}
              <div className="mt-6 text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                  Sign in to FluentX
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Access your courses, enrollments, learning progress, and
                  dashboard with your Google account.
                </p>
              </div>

              {/* Google button */}
              <form
                className="mt-8"
                action={async () => {
                  "use server";

                  await signIn("google", {
                    redirectTo: destination,
                  });
                }}
              >
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:translate-y-0 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  {/* Google logo */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.92h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.23Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21.85c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.85Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.54 13.96A5.86 5.86 0 0 1 6.23 12c0-.68.12-1.34.31-1.96V7.52H3.3A9.77 9.77 0 0 0 2.25 12c0 1.58.38 3.08 1.05 4.48l3.24-2.52Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6.01c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.13 14.63 2.15 12 2.15a9.75 9.75 0 0 0-8.7 5.37l3.24 2.52C6.93 7.73 9.08 6.01 12 6.01Z"
                    />
                  </svg>

                  <span>Continue with Google</span>

                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="ml-auto h-4 w-4 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-80"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Secure sign in
                </span>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Account information */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Your account is created automatically
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      The first time you sign in with Google, your FluentX
                      account will be created automatically.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                Securely sign in with your Google account to access FluentX.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
