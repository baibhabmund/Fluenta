import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Section } from "@/components/ui";
import { EnrollForm } from "@/components/enroll-form";
import { getService } from "@/data/services";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Enroll", robots: { index: false } };

export default async function Enroll({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/enroll/${s.slug}`)}`);
  }

  return (
    <>
      <PageHeader title={`Enroll in ${s.name}`} />
      <Section><EnrollForm slug={s.slug} name={s.name} price={s.price} userName={session.user.name ?? ""} userEmail={session.user.email ?? ""} /></Section>
    </>
  );
}
