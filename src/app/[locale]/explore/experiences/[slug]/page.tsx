import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  getCategoryBySlug,
  getPartnersByCategory,
  getAllCategories,
} from "@/lib/data/partners";
import { CategoryPartnerGrid } from "./category-partner-grid";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const categoryImages: Record<string, string> = {
  restaurants:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
  "experiences-tours":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80",
  "culture-events":
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&q=80",
  "premium-transport":
    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&q=80",
};

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const partners = getPartnersByCategory(slug);
  const name = locale === "fr" ? category.name_fr : category.name_en;

  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32">
          <div className="absolute inset-0">
            <img
              src={categoryImages[slug] ?? ""}
              alt={name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-3 text-xs tracking-luxury text-white/70 uppercase">
              {locale === "fr" ? "Catégorie" : "Category"}
            </p>
            <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
              {name}
            </h1>
          </div>
        </section>

        <section className="bg-cream px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <div className="mb-12">
                <p className="mb-3 text-xs tracking-luxury text-ocean uppercase">
                  {partners.length}{" "}
                  {locale === "fr" ? "partenaires" : "partners"}
                </p>
                <h2 className="font-heading text-3xl tracking-wide text-foreground">
                  {locale === "fr" ? "Sélection curatée" : "Curated Selection"}
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <CategoryPartnerGrid partners={partners} locale={locale} />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
