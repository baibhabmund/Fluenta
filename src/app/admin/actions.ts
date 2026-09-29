"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getService } from "@/data/services";

const back = (kind: "msg" | "error", text: string): never =>
  redirect(`/admin/access?${kind}=${encodeURIComponent(text)}`);

export async function grantAccess(formData: FormData) {
  const session = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim();
  const service = getService(String(formData.get("service") ?? ""));
  if (!email) return back("error", "Enter the user's email.");
  if (!service) return back("error", "Select a valid service.");

  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
  if (!user) {
    return back("error", `No account found for ${email}. The user must sign in once with Google first.`);
  }

  const course = await prisma.course.upsert({
    where: { slug: service.slug },
    update: {},
    create: { slug: service.slug, title: service.name, description: service.short, price: service.price, published: true },
  });

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (existing) return back("msg", `${user.email} already has access to ${service.name}.`);

  await prisma.enrollment.create({
    data: { userId: user.id, courseId: course.id, source: "ADMIN_GRANT", grantedBy: session.user.email },
  });
  revalidatePath("/admin", "layout");
  return back("msg", `Free access to ${service.name} granted to ${user.email}.`);
}

export async function revokeAccess(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("enrollmentId") ?? "");
  const enrollment = await prisma.enrollment.findUnique({ where: { id }, include: { user: true, course: true } });
  if (!enrollment) return back("error", "Enrollment not found.");
  // Paid enrollments are never removable from here.
  if (enrollment.source !== "ADMIN_GRANT") return back("error", "Only admin-granted access can be revoked.");
  await prisma.enrollment.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  return back("msg", `Access to ${enrollment.course.title} revoked for ${enrollment.user.email}.`);
}
