import { NextResponse } from "next/server";
import { consultationSchema } from "@/lib/validation";
import { getService } from "@/data/services";
import { emailConfigured, rows, sendMail } from "@/lib/email";
import { clientIp, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (rateLimited(`consult:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // bot: silently accept

  if (!emailConfigured()) {
    return NextResponse.json({ error: "Email service is not configured. Please contact us directly." }, { status: 503 });
  }
  const service = getService(d.service)!;
  const { text, html } = rows([
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Service", service.name],
    ["Preferred date", d.preferredDate || "—"],
    ["Preferred time", d.preferredTime || "—"],
    ["Message", d.message],
    ["Submitted at", new Date().toISOString()],
  ]);
  try {
    await sendMail({
      to: process.env.ADMIN_EMAIL!,
      subject: `New Free Consultation Request - ${service.name} - ${d.name.replace(/[\r\n]/g, " ")}`,
      replyTo: d.email,
      text,
      html,
    });
  } catch (e) {
    console.error("Consultation email failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "We couldn't send your request. Please try again or contact us directly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
