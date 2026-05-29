import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/shared/hero-section";
import { PersonaCards } from "@/components/assistant/persona-cards";
import { CategoryCards } from "@/components/explore/category-card";
import { RegionCards } from "@/components/explore/region-card";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <HomePageContent params={params} />;
}

async function HomePageContent({
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
        <PersonaSection />
        <CategoriesSection />
        <RegionsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

function PersonaSection() {
  const t = useTranslations("personas");
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <ScrollReveal>
          <h2 className="mb-12 font-heading text-3xl tracking-wide text-foreground md:text-4xl">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <PersonaCards />
        </ScrollReveal>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const t = useTranslations("sections");
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
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
    <section id="regions" className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
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

function CTASection() {
  const t = useTranslations("hero");
  return (
    <section className="relative overflow-hidden bg-white px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-cream opacity-50" />
      <ScrollReveal>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-4xl tracking-wide text-foreground md:text-5xl">
            Ready to Discover Mauritius?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Let our AI concierge craft your perfect itinerary. Curated
            experiences, insider knowledge, premium service.
          </p>
          <a
            href="#hero-prompt"
            className="inline-block rounded-full border border-ocean bg-ocean/5 px-10 py-4 text-xs tracking-luxury text-ocean transition-all hover:bg-ocean hover:text-white"
          >
            {t("cta")}
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
