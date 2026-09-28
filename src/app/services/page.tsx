import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Services", description: "IELTS, PTE, Duolingo, CELPIP, Spoken English, French and interview preparation." };

export default function ServicesPage() {
  return (
    <>
      <PageHeader title="Our services" intro="Choose a service to see what is included, or book a free consultation." />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.slug} service={s} showFeatures={5} />)}
        </div>
      </Section>
    </>
  );
}
