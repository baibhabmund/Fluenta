import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "outline" | "soft";
const STYLES: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  outline:
    "bg-white text-slate-900 border border-slate-300 hover:border-brand-500 hover:text-brand-700 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
  soft: "bg-brand-50 text-brand-800 border border-brand-100 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-100 dark:border-brand-800",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60 ${STYLES[variant]} ${extra}`;
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({
  title,
  eyebrow,
  intro,
  children,
  tone = "plain",
}: {
  title?: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
  tone?: "plain" | "tint";
}) {
  return (
    <section className={tone === "tint" ? "bg-brand-50/60 dark:bg-slate-900/40" : ""}>
      <Container className="py-14 sm:py-20">
        {(title || eyebrow) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>}
            {intro && <p className="mt-3 text-slate-600 dark:text-slate-300">{intro}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="border-b border-slate-200 bg-brand-50/60 dark:border-slate-800 dark:bg-slate-900/40">
      <Container className="py-12 sm:py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{intro}</p>}
      </Container>
    </div>
  );
}
