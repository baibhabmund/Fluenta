import { createHmac, timingSafeEqual } from "crypto";

const API = "https://api.razorpay.com/v1";

function auth() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) return null;
  return { id, secret, header: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64") };
}
export const razorpayConfigured = () => auth() !== null;

export async function createOrder(input: { amountPaise: number; receipt: string; notes: Record<string, string> }) {
  const a = auth();
  if (!a) throw new Error("Razorpay not configured");
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { Authorization: a.header, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: input.amountPaise, currency: "INR", receipt: input.receipt, notes: input.notes }),
  });
  if (!res.ok) throw new Error(`Razorpay order failed (${res.status})`);
  return (await res.json()) as { id: string; amount: number; currency: string };
}

export async function fetchOrder(orderId: string) {
  const a = auth();
  if (!a) throw new Error("Razorpay not configured");
  const res = await fetch(`${API}/orders/${encodeURIComponent(orderId)}`, { headers: { Authorization: a.header } });
  if (!res.ok) throw new Error(`Razorpay order fetch failed (${res.status})`);
  return (await res.json()) as { id: string; amount: number; amount_paid: number; status: string; notes: Record<string, string> };
}

/** Checkout signature: HMAC_SHA256(order_id|payment_id, key_secret). */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const a = auth();
  if (!a || !signature) return false;
  const expected = createHmac("sha256", a.secret).update(`${orderId}|${paymentId}`).digest("hex");
  const x = Buffer.from(expected);
  const y = Buffer.from(signature);
  return x.length === y.length && timingSafeEqual(x, y);
}
