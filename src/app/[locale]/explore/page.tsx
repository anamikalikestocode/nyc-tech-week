import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CategoryCards } from "@/components/explore/category-card";
import { RegionCards } from "@/components/explore/region-card";
import { CollectionCards } from "@/components/explore/collection-cards";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CollectionsSection />
        <CategoriesSection />
        <RegionsSection />
      </main>
      <Footer />
    </>
  );
}

function HeroSection() {
  const t = useTranslations("explore");
  return (
    <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80"
          alt="Mauritius landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-3 text-xs tracking-luxury text-white/70 uppercase">
          {t("label")}
        </p>
        <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/60">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}

function CollectionsSection() {
  const t = useTranslations("explore");
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="mb-3 text-xs tracking-luxury text-ocean uppercase">
              {t("curated")}
            </p>
            <h2 className="font-heading text-3xl tracking-wide text-foreground md:text-4xl">
              {t("collections")}
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <CollectionCards />
        </ScrollReveal>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const t = useTranslations("sections");
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="mb-3 text-xs tracking-luxury text-ocean uppercase">
              Explore
            </p>
            <h2 className="font-heading text-3xl tracking-wide text-foreground md:text-4xl">
              {t("categories")}
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <CategoryCards />
        </ScrollReveal>
      </div>
    </section>
  );
}

function RegionsSection() {
  const t = useTranslations("sections");
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12">
            <p className="mb-3 text-xs tracking-luxury text-ocean uppercase">
              Discover
            </p>
            <h2 className="font-heading text-3xl tracking-wide text-foreground md:text-4xl">
              {t("regions")}
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <RegionCards />
        </ScrollReveal>
      </div>
    </section>
  );
}
