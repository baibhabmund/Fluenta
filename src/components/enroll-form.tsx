"use client";
import Script from "next/script";
import { FormEvent, useState } from "react";
import { buttonClass } from "@/components/ui";
import { formatINR } from "@/data/services";

declare global {
  interface Window {
    Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void };
  }
}

const input =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

type Details = { name: string; email: string; phone: string; service: string; amount: string; orderId: string; paymentId: string };

export function EnrollForm({ slug, name: serviceName, price, userName, userEmail }: { slug: string; name: string; price: number; userName: string; userEmail: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<{ details: Details; emailSent: boolean } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    if (!window.Razorpay) return setMsg("Payment library is still loading. Please try again in a moment.");
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.get("name"), email: f.get("email"), phone: f.get("phone"), service: slug }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not start payment.");

      const rzp = new window.Razorpay!({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: "FluentX", description: order.serviceName,
        prefill: { name: f.get("name"), email: f.get("email"), contact: f.get("phone") },
        theme: { color: "#0b8577" },
        modal: { ondismiss: () => { setBusy(false); setMsg("Payment cancelled. You have not been charged."); } },
        handler: async (r: Record<string, string>) => {
          try {
            const v = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
            const data = await v.json();
            if (!v.ok) throw new Error(data.error || "Verification failed.");
            setDone(data);
          } catch (err) {
            setMsg((err instanceof Error ? err.message : "Verification failed.") + ` If money was deducted, contact us with payment ID ${r.razorpay_payment_id}.`);
          } finally { setBusy(false); }
        },
      });
      rzp.on("payment.failed", (r) => { setBusy(false); setMsg(r.error?.description || "Payment failed. Please try again."); });
      rzp.open();
    } catch (err) {
      setBusy(false);
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (done) {
    const d = done.details;
    return (
      <div role="status" className="max-w-xl rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-900/30">
        <h2 className="text-xl font-extrabold">Payment successful — you&apos;re enrolled</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="font-bold">Name</dt><dd>{d.name}</dd>
          <dt className="font-bold">Email</dt><dd className="break-all">{d.email}</dd>
          <dt className="font-bold">Service</dt><dd>{d.service}</dd>
          <dt className="font-bold">Amount</dt><dd>{d.amount}</dd>
          <dt className="font-bold">Payment ID</dt><dd className="break-all">{d.paymentId}</dd>
        </dl>
        <p className="mt-4 text-sm">{done.emailSent ? "A confirmation email has been sent." : "Our team will contact you shortly. Please keep your payment ID for reference."}</p>
      </div>
    );
  }
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
        <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
          <p className="font-bold">{serviceName}</p>
          <p className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">{formatINR(price)}</p>
        </div>
        <label className="text-sm font-semibold">Full name *<input name="name" required minLength={2} autoComplete="name" defaultValue={userName} className={input} /></label>
        <label className="text-sm font-semibold">Google account email<input name="email" type="email" value={userEmail} readOnly className={`${input} cursor-not-allowed opacity-80`} /></label>
        <label className="text-sm font-semibold">Phone *<input name="phone" type="tel" required autoComplete="tel" className={input} /></label>
        {msg && <p role="alert" className="text-sm font-semibold text-red-600 dark:text-red-400">{msg}</p>}
        <button type="submit" disabled={busy} className={buttonClass("primary", "w-full sm:w-fit")}>
          {busy ? "Processing…" : `Pay ${formatINR(price)} with Razorpay`}
        </button>
      </form>
    </>
  );
}
