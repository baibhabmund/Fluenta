import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

/** Comma-separated Google emails allowed into /admin. Falls back to ADMIN_EMAIL. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const isAdminEmail = (email?: string | null) => !!email && adminEmails().includes(email.toLowerCase());

/** Server-side guard. Signed-out → login; signed-in non-admins get a 404 (page existence is hidden). */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (!isAdminEmail(session.user.email)) notFound();
  return session as typeof session & { user: { id: string; email: string } };
}

export const formatDateTime = (d: Date) =>
  d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
