import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function ErrorState({
  code,
  icon: Icon,
  title,
  body,
  action,
}: {
  code?: string;
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/50 dark:bg-brand-500/5 blur-3xl" />
      <div className="relative flex max-w-md flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
          <Icon className="h-8 w-8" />
        </div>
        {code && <p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-brand-600 dark:text-brand-400">{code}</p>}
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {action ?? (
            <Link
              href="/"
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
            >
              Back home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
