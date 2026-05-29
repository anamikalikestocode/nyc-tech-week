import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function AboutPage({
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
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden px-6 pb-16 pt-32">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80"
              alt="Mauritius aerial landscape"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-3 text-xs tracking-luxury text-ocean-light uppercase">
              Discover the Island
            </p>
            <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
              About Mauritius
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/70">
              A jewel of the Indian Ocean where turquoise lagoons, volcanic
              peaks, and centuries of cultural richness converge.
            </p>
          </div>
        </section>

        {/* Geography */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-3xl tracking-wide text-foreground">
              Geography
            </h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Mauritius lies roughly 2,000 kilometres off the southeast
                  coast of Africa in the Indian Ocean. The island spans about
                  65 kilometres from north to south and 45 kilometres east to
                  west, surrounded by the world&apos;s third-largest coral reef
                  system.
                </p>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  The interior rises to a central plateau crowned by volcanic
                  peaks, the highest being Piton de la Petite Rivi&egrave;re
                  Noire at 828 metres. Lush sugar cane fields, dramatic gorges,
                  crater lakes, and cascading waterfalls define the landscape
                  beyond the famous coastal lagoons.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80"
                  alt="Mauritius coastal landscape"
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Culture */}
        <section className="bg-cream px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-3xl tracking-wide text-foreground">
              Culture
            </h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              <div className="flex items-center justify-center md:order-2">
                <img
                  src="https://images.unsplash.com/photo-1597739239353-50270a473397?w=800&q=80"
                  alt="Mauritius cultural scene"
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="md:order-1">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Mauritius is one of the most culturally diverse nations on
                  Earth. Descendants of settlers from India, Africa, China,
                  and Europe have created a society where Hindu temples, mosques,
                  churches, and pagodas stand side by side.
                </p>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  This heritage is reflected in the cuisine, festivals, and
                  everyday life of the island. From the colourful celebration
                  of Diwali and the Chinese Spring Festival to the rhythmic
                  beats of S&eacute;ga music, visitors experience a mosaic
                  of traditions found nowhere else.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Climate */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-3xl tracking-wide text-foreground">
              Climate
            </h2>
            <div className="mt-8 grid gap-12 md:grid-cols-3">
              <div className="rounded-2xl border border-ocean/10 bg-ocean-light/30 p-8">
                <h3 className="font-heading text-xl text-ocean">
                  Summer (Nov&ndash;Apr)
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Warm and humid with temperatures between 25&ndash;33 &deg;C.
                  Ideal for water sports and beach days, with brief tropical
                  showers that refresh the island.
                </p>
              </div>
              <div className="rounded-2xl border border-ocean/10 bg-ocean-light/30 p-8">
                <h3 className="font-heading text-xl text-ocean">
                  Winter (May&ndash;Oct)
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Cooler and drier with temperatures between 17&ndash;25 &deg;C.
                  Perfect for hiking, sightseeing, and exploring the interior.
                  The east coast is breezier while the west stays calmer.
                </p>
              </div>
              <div className="rounded-2xl border border-ocean/10 bg-ocean-light/30 p-8">
                <h3 className="font-heading text-xl text-ocean">
                  Year-Round
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Sea temperatures hover around 23&ndash;27 &deg;C making
                  Mauritius a year-round destination. The reef-protected
                  lagoons stay calm even on windier days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Around */}
        <section className="bg-cream px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-3xl tracking-wide text-foreground">
              Getting Around
            </h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The island is compact enough to drive from coast to coast in
                  about an hour, making day trips to any region easy. A modern
                  motorway connects the airport in the southeast to the capital
                  Port Louis in the northwest.
                </p>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  For the best experience, we recommend a private chauffeur
                  service. Driving is on the left, roads can be narrow, and
                  local knowledge makes all the difference. Helicopter
                  transfers, scenic seaplane flights, and luxury catamarans
                  offer memorable alternatives for reaching offshore islands
                  and remote beaches.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"
                  alt="Luxury transport in Mauritius"
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
