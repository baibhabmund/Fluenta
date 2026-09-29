import { ReactNode } from "react";
import { Search } from "lucide-react";

export const tableWrap =
  "mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

export function Th({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{children}</th>;
}

export function Td({ children, className = "", colSpan }: { children: ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`px-4 py-3 align-top text-slate-700 dark:text-slate-300 ${className}`}>{children}</td>;
}

export function SearchBar({ q, placeholder }: { q: string; placeholder: string }) {
  return (
    <form className="flex gap-2" method="get">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          className="w-full min-w-[16rem] rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-brand-900/40"
        />
      </div>
      <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">Search</button>
    </form>
  );
}
