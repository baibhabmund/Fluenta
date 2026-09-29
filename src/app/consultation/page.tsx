import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { ConsultationForm } from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Free Consultation",
  description: "Book a free demo and consultation with FluentX.",
};

export default async function Consultation({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <PageHeader
        title="Schedule a free consultation"
        intro="Tell us what you need. We'll reply within 24 hours with a meeting link."
      />

      {/* Consultation Form */}
      <Section>
        <ConsultationForm defaultService={sp.service} />
      </Section>
    </div>
  );
}
