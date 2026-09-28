export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {items.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="cursor-pointer list-none font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300">
            {f.q}
          </summary>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
