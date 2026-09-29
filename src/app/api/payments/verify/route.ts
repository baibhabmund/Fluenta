import { NextResponse } from "next/server";
import { verifySchema } from "@/lib/validation";
import { fetchOrder, verifySignature } from "@/lib/razorpay";
import { getService, formatINR } from "@/data/services";
import { emailConfigured, rows, sendMail } from "@/lib/email";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Please sign in before confirming your enrollment." }, { status: 401 });
  }
  if (rateLimited(`verify:${clientIp(req)}`, 20, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const parsed = verifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payment response." }, { status: 400 });
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: sig } = parsed.data;

  if (!verifySignature(orderId, paymentId, sig)) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }
  try {
    // Trust Razorpay's stored order (not the browser) for who/what/how much.
    const order = await fetchOrder(orderId);
    const service = getService(order.notes?.service ?? "");
    if (!service || order.amount !== service.price * 100) {
      return NextResponse.json({ error: "Order details mismatch." }, { status: 400 });
    }
    const userId = order.notes?.userId;
    if (userId !== session.user.id || order.notes?.email !== session.user.email) {
      return NextResponse.json({ error: "This payment does not belong to the signed-in account." }, { status: 403 });
    }

    const course = await prisma.course.upsert({
      where: { slug: service.slug },
      update: { title: service.name, description: service.short, price: service.price, published: true },
      create: { slug: service.slug, title: service.name, description: service.short, price: service.price, published: true },
    });

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      update: {},
      create: { userId: session.user.id, courseId: course.id },
    });

    // Best-effort payment record for the admin dashboard (idempotent on paymentId).
    try {
      await prisma.payment.upsert({
        where: { paymentId },
        update: {},
        create: {
          userId: session.user.id,
          name: order.notes.name,
          email: order.notes.email,
          phone: order.notes.phone,
          courseSlug: service.slug,
          serviceName: service.name,
          amount: service.price,
          orderId,
          paymentId,
        },
      });
    } catch (e) {
      console.error("Payment record failed:", e instanceof Error ? e.message : e);
    }

    const details = {
      name: order.notes.name,
      email: order.notes.email,
      phone: order.notes.phone,
      service: service.name,
      amount: formatINR(service.price),
      orderId,
      paymentId,
    };

    // Emails are best-effort and reported honestly.
    let emailSent = false;
    if (emailConfigured()) {
      const { text, html } = rows([
        ["Name", details.name], ["Email", details.email], ["Phone", details.phone],
        ["Service", details.service], ["Amount", details.amount],
        ["Order ID", orderId], ["Payment ID", paymentId],
      ]);
      try {
        await sendMail({ to: process.env.ADMIN_EMAIL!, subject: `New Enrollment - ${details.service} - ${details.name}`, replyTo: details.email, text, html });
        await sendMail({
          to: details.email,
          subject: `Your FluentX enrollment - ${details.service}`,
          text: `Hi ${details.name},\n\nThank you for enrolling in ${details.service}. We received your payment of ${details.amount}.\n\n${text}\n\nOur team will contact you shortly.`,
          html: `<p>Hi ${details.name.replace(/[<>&]/g, "")},</p><p>Thank you for enrolling in ${details.service}. We received your payment of ${details.amount}.</p>${html}<p>Our team will contact you shortly.</p>`,
        });
        emailSent = true;
      } catch (e) {
        console.error("Enrollment email failed:", e instanceof Error ? e.message : e);
      }
    }
    return NextResponse.json({ ok: true, details, emailSent });
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not confirm your order. Please contact us with your payment ID." }, { status: 502 });
  }
}
