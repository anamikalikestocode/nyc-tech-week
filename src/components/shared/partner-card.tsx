import { Link } from "@/i18n/navigation";
import type { PartnerWithRelations } from "@/lib/types/database";
import { ArrowRight } from "lucide-react";

interface PartnerCardProps {
  partner: PartnerWithRelations;
  locale: string;
}

export function PartnerCard({ partner, locale }: PartnerCardProps) {
  const desc =
    locale === "fr" ? partner.short_desc_fr : partner.short_desc_en;
  const regionName =
    locale === "fr" ? partner.region?.name_fr : partner.region?.name_en;

  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={partner.hero_image ?? ""}
          alt={partner.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wider text-ocean uppercase backdrop-blur-sm">
            {partner.price_range}
          </span>
          {regionName && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wider text-charcoal/60 uppercase backdrop-blur-sm">
              {regionName}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-heading text-lg tracking-wide text-foreground">
          {partner.name}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
        {partner.tags && partner.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {partner.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full border border-border px-2.5 py-0.5 text-[10px] tracking-wide text-muted-foreground"
              >
                {locale === "fr" ? tag.name_fr : tag.name_en}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs tracking-wide text-ocean/70 transition-colors group-hover:text-ocean">
          <span>{locale === "fr" ? "Découvrir" : "View"}</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 h-1 origin-left scale-x-0 bg-ocean transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}
