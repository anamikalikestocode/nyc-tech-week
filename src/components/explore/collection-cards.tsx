"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllCollections } from "@/lib/data/partners";
import { ArrowRight } from "lucide-react";

export function CollectionCards() {
  const locale = useLocale();
  const collections = getAllCollections();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {collections.map((col) => {
        const title = locale === "fr" ? col.title_fr : col.title_en;
        const subtitle = locale === "fr" ? col.subtitle_fr : col.subtitle_en;
        return (
          <Link
            key={col.slug}
            href={`/explore/collections/${col.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl"
          >
            <img
              src={col.hero_image ?? ""}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="mb-1 text-xs tracking-luxury text-white/70 uppercase">
                {subtitle}
              </p>
              <h3 className="font-heading text-2xl tracking-wide text-white">
                {title}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-xs tracking-wide text-white/60 transition-colors group-hover:text-white">
                <span>{locale === "fr" ? "Découvrir" : "Explore"}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 left-0 h-1 origin-left scale-x-0 bg-ocean transition-transform duration-500 group-hover:scale-x-100" />
          </Link>
        );
      })}
    </div>
  );
}
