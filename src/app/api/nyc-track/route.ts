import { createAdminClient } from "@/lib/supabase/admin";

// RSVP click tracking. Anonymous product analytics only: which events the
// directory/chatbot surface and which ones people actually click through to
// RSVP. No PII, no IP, no identity — just an anonymous first-party session id
// (random UUID from the visitor's localStorage) so clicks can be grouped into
// sessions in aggregate. This is the core of the demand-intelligence dataset.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventUrl =
      typeof body?.event_url === "string" ? body.event_url.slice(0, 500) : "";

    if (eventUrl.length > 0) {
      const row = {
        session_id:
          typeof body?.session_id === "string"
            ? body.session_id.slice(0, 64)
            : null,
        event_url: eventUrl,
        event_name:
          typeof body?.event_name === "string"
            ? body.event_name.slice(0, 300)
            : null,
        source: body?.source === "chat" ? "chat" : body?.source === "card" ? "card" : "unknown",
      };

      // Fire-and-forget: a logging failure must never affect the user.
      void createAdminClient()
        .from("nyc_rsvp_clicks")
        .insert(row)
        .then(
          ({ error }) => {
            if (error) console.error("[nyc-track] insert failed:", error.message);
          },
          (e) => console.error("[nyc-track] insert threw:", e)
        );
    }
  } catch (e) {
    console.error("[nyc-track] bad request:", e);
  }

  // Always 204 — sendBeacon ignores the body anyway, and we never want a
  // tracking error to surface to the client.
  return new Response(null, { status: 204 });
}
