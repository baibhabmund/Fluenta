import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

const isSafeCallback = (value?: string) => Boolean(value?.startsWith("/") && !value.startsWith("//"));

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) redirect(isSafeCallback(callbackUrl) ? callbackUrl! : "/dashboard");

  const destination = isSafeCallback(callbackUrl) ? callbackUrl! : "/dashboard";

  return (
    <>
      <PageHeader title="Sign in" />
      <Section>
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Continue with Google</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Use your Google account to access your courses and dashboard.
            </p>
          </div>

          <form
            className="mt-6"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: destination });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <span className="text-base font-black">G</span>
              Continue with Google
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            Your account is created automatically the first time you sign in with Google.
          </p>
        </div>
      </Section>
    </>
  );
}
