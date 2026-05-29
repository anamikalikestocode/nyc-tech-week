"use client";

import { useLocale } from "next-intl";
import {
  Heart,
  Users,
  Compass,
  Sparkles,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { PERSONAS } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  compass: Compass,
  sparkles: Sparkles,
  briefcase: Briefcase,
};

export function PersonaCards() {
  const locale = useLocale();

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
      {PERSONAS.map((persona) => {
        const Icon = iconMap[persona.icon];
        const label = locale === "fr" ? persona.labelFr : persona.labelEn;
        return (
          <button
            key={persona.id}
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("lami:open-chat", {
                  detail: { prompt: persona.prompt },
                })
              );
            }}
            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-white px-4 py-8 shadow-sm transition-all hover:border-ocean/30 hover:shadow-md"
          >
            <Icon className="h-6 w-6 text-ocean/50 transition-colors group-hover:text-ocean" />
            <span className="text-sm tracking-wide text-foreground/70 transition-colors group-hover:text-foreground">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
