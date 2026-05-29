import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCollectionBySlug, getAllCollections } from "@/lib/data/partners";
import { CollectionPartnerGrid } from "./collection-partner-grid";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = getCollectionBySlug(slug);
  if (!data) notFound();

  const { collection, partners } = data;
  const title = locale === "fr" ? collection.title_fr : collection.title_en;
  const subtitle =
    locale === "fr" ? collection.subtitle_fr : collection.subtitle_en;
  const description =
    locale === "fr" ? collection.description_fr : collection.description_en;

  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32">
          <div className="absolute inset-0">
            <img
              src={collection.hero_image ?? ""}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-3 text-xs tracking-luxury text-white/70 uppercase">
              {subtitle}
            </p>
            <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
              {description}
            </p>
          </div>
        </section>

        <section className="bg-cream px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <CollectionPartnerGrid partners={partners} locale={locale} />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
