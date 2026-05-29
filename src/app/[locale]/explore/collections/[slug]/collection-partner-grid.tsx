"use client";

import { PartnerCard } from "@/components/shared/partner-card";
import type { PartnerWithRelations } from "@/lib/types/database";

export function CollectionPartnerGrid({
  partners,
  locale,
}: {
  partners: PartnerWithRelations[];
  locale: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner) => (
        <PartnerCard key={partner.slug} partner={partner} locale={locale} />
      ))}
    </div>
  );
}
