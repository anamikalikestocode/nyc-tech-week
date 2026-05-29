import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getRegionBySlug, getPartnersByRegion, getAllRegions } from "@/lib/data/partners";
import { RegionPartnerGrid } from "./region-partner-grid";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function generateStaticParams() {
  return getAllRegions().map((r) => ({ slug: r.slug }));
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const region = getRegionBySlug(slug);
  if (!region) notFound();

  const partners = getPartnersByRegion(slug);
  const name = locale === "fr" ? region.name_fr : region.name_en;
  const description =
    locale === "fr" ? region.description_fr : region.description_en;

  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32">
          <div className="absolute inset-0">
            <img
              src={region.hero_image ?? ""}
              alt={name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-3 text-xs tracking-luxury text-white/70 uppercase">
              {locale === "fr" ? "Région" : "Region"}
            </p>
            <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
              {name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
              {description}
            </p>
          </div>
        </section>

        <section className="bg-cream px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <div className="mb-12">
                <p className="mb-3 text-xs tracking-luxury text-ocean uppercase">
                  {locale === "fr" ? "Nos partenaires" : "Our Partners"}
                </p>
                <h2 className="font-heading text-3xl tracking-wide text-foreground">
                  {locale === "fr"
                    ? `Découvrez le ${name}`
                    : `Discover the ${name}`}
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <RegionPartnerGrid partners={partners} locale={locale} />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
