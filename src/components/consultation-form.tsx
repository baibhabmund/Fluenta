"use client";
import { FormEvent, ReactNode, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { buttonClass } from "@/components/ui";
import { services } from "@/data/services";

const base =
  "w-full rounded-xl border bg-white py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";
const ok = "border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-600";
const bad = "border-red-500 dark:border-red-400";

const steps = [
  { icon: Send, title: "Send your request", text: "Tell us your goals and the service you're interested in." },
  { icon: Clock, title: "We reply within 24 hours", text: "You'll get an email with a meeting link for your free demo." },
  { icon: MessageCircle, title: "Talk it through", text: "Ask questions and choose the plan that fits you." },
];

function Field({
  label,
  required,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  icon?: typeof User;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
      {label}
      {required && <span className="text-brand-700 dark:text-brand-300"> *</span>}
      <span className="relative mt-1.5 block">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
        )}
        {children}
      </span>
      {error && (
        <span role="alert" className="mt-1.5 block text-xs font-semibold text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

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
      <div
        role="status"
        className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-brand-200 bg-white p-8 text-center shadow-xl shadow-brand-500/10 dark:border-brand-800 dark:bg-slate-900"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-400/25 blur-3xl" />
        <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="relative mt-5 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Thank you for your request
        </h2>
        <p className="relative mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Our team will review your message and contact you within 24 hours.
        </p>
      </div>
    );
  }

  const cls = (k: string, pad = "pl-10 pr-3") => `${base} ${pad} ${fields[k]?.[0] ? bad : ok}`;
  const e0 = (k: string) => fields[k]?.[0];
  const sending = status === "sending";

  return (
    <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
      {/* Side panel */}
      <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-7 text-white lg:col-span-2 lg:self-start">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="relative">
          <h2 className="text-2xl font-black tracking-tight text-white">What happens next</h2>
          <ol className="mt-6 space-y-5">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-white">
                    <span className="mr-2 text-xs font-black tracking-widest text-white/60">0{i + 1}</span>
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/85">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-7 flex items-center gap-2 border-t border-white/20 pt-5 text-xs font-semibold text-white/90">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            Free consultation. No account needed.
          </p>
        </div>
      </aside>

      {/* Form card */}
      <form
        onSubmit={onSubmit}
        noValidate
        className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:col-span-3"
      >
        <div className="hidden" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <Field label="Full name" required icon={User} error={e0("name")}>
          <input name="name" required autoComplete="name" placeholder="Your full name" aria-invalid={!!e0("name")} className={cls("name")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" required icon={Mail} error={e0("email")}>
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" aria-invalid={!!e0("email")} className={cls("email")} />
          </Field>
          <Field label="Phone" required icon={Phone} error={e0("phone")}>
            <input name="phone" type="tel" required autoComplete="tel" placeholder="+91 98765 43210" aria-invalid={!!e0("phone")} className={cls("phone")} />
          </Field>
        </div>

        <Field label="Service" required error={e0("service")}>
          <select
            name="service"
            required
            defaultValue={services.some((s) => s.slug === defaultService) ? defaultService : ""}
            aria-invalid={!!e0("service")}
            className={cls("service", "px-3")}
          >
            <option value="" disabled>Select a service</option>
            {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Preferred date (optional)" icon={CalendarDays}>
            <input name="preferredDate" type="date" className={cls("preferredDate")} />
          </Field>
          <Field label="Preferred time (optional)" icon={Clock}>
            <input name="preferredTime" type="time" className={cls("preferredTime")} />
          </Field>
        </div>

        <Field label="Message / requirements" required error={e0("message")}>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Tell us your goals, target score or test date…"
            aria-invalid={!!e0("message")}
            className={cls("message", "px-3")}
          />
        </Field>

        <div>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300" />
            <span>I agree to be contacted about my request. <span className="text-brand-700 dark:text-brand-300">*</span></span>
          </label>
          {e0("consent") && (
            <p role="alert" className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">{e0("consent")}</p>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={sending} className={buttonClass("primary", "w-full !py-3.5 sm:w-fit sm:!px-8")}>
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send request
            </>
          )}
        </button>
      </form>
    </div>
  );
}