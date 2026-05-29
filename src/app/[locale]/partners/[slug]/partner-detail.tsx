"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PartnerWithRelations } from "@/lib/types/database";
import {
  MapPin,
  Phone,
  Globe,
  Star,
  ArrowLeft,
} from "lucide-react";
import { LeadForm } from "@/components/leads/lead-form";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function PartnerDetail({
  partner,
  locale,
}: {
  partner: PartnerWithRelations;
  locale: string;
}) {
  const t = useTranslations("partner");
  const description =
    locale === "fr" ? partner.description_fr : partner.description_en;
  const regionName =
    locale === "fr" ? partner.region?.name_fr : partner.region?.name_en;
  const categoryName =
    locale === "fr" ? partner.category?.name_fr : partner.category?.name_en;

  return (
    <>
      {/* Hero — dark overlay on image */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden px-6 pb-16 pt-32">
        <div className="absolute inset-0">
          <img
            src={partner.hero_image ?? ""}
            alt={partner.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl">
          <Link
            href="/explore"
            className="mb-6 inline-flex items-center gap-2 text-xs tracking-wide text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            {locale === "fr" ? "Retour" : "Back"}
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] tracking-luxury text-white uppercase backdrop-blur-sm">
              {categoryName}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] tracking-luxury text-white/70 uppercase backdrop-blur-sm">
              {regionName}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] tracking-luxury text-white/70 uppercase backdrop-blur-sm">
              {partner.price_range}
            </span>
          </div>
          <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
            {partner.name}
          </h1>
        </div>
      </section>

      {/* Content — light background */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {description}
                </p>

                {/* Tags */}
                {partner.tags && partner.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {partner.tags.map((tag) => (
                      <span
                        key={tag.slug}
                        className="rounded-full border border-border bg-white px-3 py-1 text-xs tracking-wide text-muted-foreground"
                      >
                        {locale === "fr" ? tag.name_fr : tag.name_en}
                      </span>
                    ))}
                  </div>
                )}
              </ScrollReveal>

              {/* Signature Offers */}
              {partner.signature_offers.length > 0 && (
                <ScrollReveal delay={150}>
                  <div className="mt-16">
                    <h2 className="mb-8 font-heading text-2xl tracking-wide text-foreground">
                      {t("signatureOffers")}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {partner.signature_offers.map((offer, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4 text-gold" />
                            <span className="text-xs tracking-luxury text-gold uppercase">
                              Signature
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {locale === "fr" ? offer.fr : offer.en}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <ScrollReveal delay={200}>
                <LeadForm
                  partnerSlug={partner.slug}
                  partnerName={partner.name}
                />
              </ScrollReveal>

              {/* Details card */}
              <ScrollReveal delay={300}>
                <div className="rounded-xl border border-border bg-white p-8 shadow-sm space-y-6">
                  {partner.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
                      <div>
                        <p className="mb-1 text-xs tracking-wide text-foreground/40 uppercase">
                          {t("location")}
                        </p>
                        <p className="text-sm text-muted-foreground">{partner.address}</p>
                      </div>
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
                      <div>
                        <p className="mb-1 text-xs tracking-wide text-foreground/40 uppercase">
                          {locale === "fr" ? "Téléphone" : "Phone"}
                        </p>
                        <p className="text-sm text-muted-foreground">{partner.phone}</p>
                      </div>
                    </div>
                  )}
                  {partner.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
                      <div>
                        <p className="mb-1 text-xs tracking-wide text-foreground/40 uppercase">
                          {t("visitWebsite")}
                        </p>
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-ocean transition-colors hover:text-ocean/80"
                        >
                          {new URL(partner.website).hostname}
                        </a>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-1 text-xs tracking-wide text-foreground/40 uppercase">
                      {t("priceRange")}
                    </p>
                    <p className="text-sm text-muted-foreground">{partner.price_range}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
