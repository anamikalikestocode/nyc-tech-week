import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/constants";
import {
  Utensils,
  Sailboat,
  Landmark,
  Car,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  sailboat: Sailboat,
  landmark: Landmark,
  car: Car,
};

const categoryImages: Record<string, string> = {
  restaurants:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "experiences-tours":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  "culture-events":
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80",
  "premium-transport":
    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=80",
};

export function CategoryCards() {
  const locale = useLocale();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon];
        const name = locale === "fr" ? cat.nameFr : cat.nameEn;
        return (
          <Link
            key={cat.slug}
            href={`/explore/experiences/${cat.slug}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl"
          >
            <img
              src={categoryImages[cat.slug]}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Icon className="h-7 w-7 text-white/80" />
              <h3 className="font-heading text-xl tracking-wide text-white md:text-2xl">
                {name}
              </h3>
            </div>
            <div className="absolute right-0 bottom-0 left-0 h-1 origin-left scale-x-0 bg-ocean transition-transform duration-500 group-hover:scale-x-100" />
          </Link>
        );
      })}
    </div>
  );
}
