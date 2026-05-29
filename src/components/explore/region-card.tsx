"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { REGIONS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const regionImages: Record<string, string> = {
  north:
    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
  east: "https://images.unsplash.com/photo-1597739239353-50270a473397?w=800&q=80",
  south:
    "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",
  west: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
};

const regionDescriptions: Record<
  string,
  { en: string; fr: string }
> = {
  north: {
    en: "Grand Baie, Port Louis, Pamplemousses — vibrant nightlife, markets, and culture",
    fr: "Grand Baie, Port Louis, Pamplemousses — vie nocturne, marchés et culture",
  },
  east: {
    en: "Belle Mare, Île aux Cerfs — pristine beaches and water sports",
    fr: "Belle Mare, Île aux Cerfs — plages immaculées et sports nautiques",
  },
  south: {
    en: "Le Morne, Chamarel, Black River — dramatic landscapes and nature",
    fr: "Le Morne, Chamarel, Rivière Noire — paysages spectaculaires et nature",
  },
  west: {
    en: "Flic en Flac, Tamarin — sunsets, dolphins, and surf",
    fr: "Flic en Flac, Tamarin — couchers de soleil, dauphins et surf",
  },
};

export function RegionCards() {
  const locale = useLocale();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {REGIONS.map((region) => {
        const name = locale === "fr" ? region.nameFr : region.nameEn;
        const desc =
          regionDescriptions[region.slug]?.[locale as "en" | "fr"] ?? "";
        return (
          <Link
            key={region.slug}
            href={`/explore/regions/${region.slug}`}
            className="group relative aspect-[16/9] overflow-hidden rounded-xl"
          >
            <img
              src={regionImages[region.slug]}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="mb-1 text-xs tracking-luxury text-white/80 uppercase">
                {name}
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-white/60">
                {desc}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs tracking-wide text-white/60 transition-colors group-hover:text-white">
                <span>Explore</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-ocean transition-transform duration-500 group-hover:scale-x-100" />
          </Link>
        );
      })}
    </div>
  );
}
