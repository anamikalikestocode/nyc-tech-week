import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CalendarDays } from "lucide-react";

export default async function SharedItineraryPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);

  // TODO: Fetch itinerary by share_token from Supabase
  // const supabase = await createClient();
  // const { data: itinerary } = await supabase
  //   .from("itineraries")
  //   .select("*, itinerary_days(*, itinerary_items(*, partners(*)))")
  //   .eq("share_token", token)
  //   .single();

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-background px-6 py-32">
        <div className="mx-auto max-w-5xl text-center">
          <CalendarDays className="mx-auto mb-4 h-12 w-12 text-gold/40" />
          <h1 className="mb-2 font-heading text-3xl tracking-wide text-white">
            Shared Itinerary
          </h1>
          <p className="text-sm text-white/50">
            Token: {token}
          </p>
          <p className="mt-4 text-white/40">
            This page will display a shared itinerary once Supabase is connected.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
