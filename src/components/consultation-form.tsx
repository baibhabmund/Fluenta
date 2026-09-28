"use client";
import { FormEvent, useState } from "react";
import { buttonClass } from "@/components/ui";
import { services } from "@/data/services";

const input =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export function ConsultationForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string[]>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    setFields({});
    const payload = {
      name: f.get("name"), email: f.get("email"), phone: f.get("phone"), service: f.get("service"),
      preferredDate: f.get("preferredDate"), preferredTime: f.get("preferredTime"),
      message: f.get("message"), consent: f.get("consent") === "on", website: f.get("website"),
    };
    try {
      const res = await fetch("/api/consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return setStatus("done");
      setError(data.error || "Something went wrong.");
      setFields(data.fields || {});
      setStatus("error");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="max-w-xl rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-900/30">
        <h2 className="text-xl font-extrabold">Thank you for your request</h2>
        <p className="mt-2 text-sm">Our team will review your message and contact you within 24 hours.</p>
      </div>
    );
  }
  const err = (k: string) => fields[k]?.[0] && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fields[k][0]}</p>;
  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-4" noValidate>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="text-sm font-semibold">Full name *<input name="name" required autoComplete="name" className={input} />{err("name")}</label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Email *<input name="email" type="email" required autoComplete="email" className={input} />{err("email")}</label>
        <label className="text-sm font-semibold">Phone *<input name="phone" type="tel" required autoComplete="tel" className={input} />{err("phone")}</label>
      </div>
      <label className="text-sm font-semibold">Service *
        <select name="service" required defaultValue={services.some((s) => s.slug === defaultService) ? defaultService : ""} className={input}>
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>{err("service")}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Preferred date (optional)<input name="preferredDate" type="date" className={input} /></label>
        <label className="text-sm font-semibold">Preferred time (optional)<input name="preferredTime" type="time" className={input} /></label>
      </div>
      <label className="text-sm font-semibold">Message / requirements *<textarea name="message" required rows={5} className={input} />{err("message")}</label>
      <label className="flex items-start gap-2 text-sm"><input name="consent" type="checkbox" required className="mt-1 h-4 w-4" />
        <span>I agree to be contacted about my request. *</span></label>
      {err("consent")}
      {error && <p role="alert" className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "w-full sm:w-fit")}>
        {status === "sending" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
