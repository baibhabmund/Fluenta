import { NextResponse } from "next/server";
import { enrollSchema } from "@/lib/validation";
import { getService } from "@/data/services";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";
import { clientIp, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (rateLimited(`order:${clientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  const parsed = enrollSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const d = parsed.data;
  const service = getService(d.service)!; // price ALWAYS from server data, never from client
  try {
    const order = await createOrder({
      amountPaise: service.price * 100,
      receipt: `fx_${Date.now().toString(36)}`,
      notes: { name: d.name, email: d.email, phone: d.phone, service: service.slug },
    });
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      serviceName: service.name,
    });
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
