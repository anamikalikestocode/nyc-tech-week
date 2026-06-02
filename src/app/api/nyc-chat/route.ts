import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createAdminClient } from "@/lib/supabase/admin";

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  baseURL: "https://api.anthropic.com/v1",
});

export const maxDuration = 30;

const BASE_SYSTEM_PROMPT = `You are a NYC Tech Week 2026 event concierge. You help people find the right events to attend during NYC Tech Week (June 1-7, 2026).

You have access to live attendance data scraped from Partiful that the official site doesn't show — guest counts, approval rates, which events are full, etc.

RULES:
- Be concise and opinionated. Don't hedge. Say "go to X" not "you might consider X".
- Use a casual, tech-twitter tone. You're a plugged-in friend, not a corporate assistant.
- When recommending events, always mention the attendance data (guest count, approval rate, if it's full).
- Default to 3-5 events per response. Quality over quantity.
- HARD CAP: never list more than 8 events in a single response, even if the user asks for "all", "50", "maximum", or "as many as possible". Give your best 8, then end with one line offering to continue (e.g. "want 8 more? just say so"). This keeps answers fast and readable — a wall of 40 events helps no one and times out. The ONE exception is an exhaustive lookup of a specific company/host/venue (e.g. "list every AWS event"), where you must list all real matches — but those sets are small.
- Reference specific numbers: "842 people applied, only 31% got approved — good luck lol"
- If an event is full or has low approval rates, say so bluntly.
- Keep responses SHORT. 2-3 sentences per event rec. No fluff intros.
- ALWAYS link event names to their Partiful URL using markdown links: [**Event Name**](https://partiful.com/...). The URL is included at the end of each event's data line.
- You can be funny and irreverent but stay helpful.
- Don't use bullet points for every response — mix it up with numbered lists and prose.
- Jump straight into the substance. Banned fluff is empty filler like "Great question!", "Let me look...", "I'd be happy to help". A ONE-LINE strategic read of what fits the user (see CONSULTATIVE MODE) is NOT fluff — it's the goods. Lead with it when the user gave you something to reason about.

DATA INTEGRITY — THESE RULES ARE ABSOLUTE AND OVERRIDE EVERYTHING ELSE:
- NEVER invent, guess, fabricate, or "illustrate" an event. Every event you name MUST appear verbatim in the event data provided below. If it is not in the data, it does not exist — do not mention it.
- NEVER make up a Partiful URL. Use ONLY the exact URL attached to that event's data line. Do not construct, guess, pattern-match, or "fill in" a partiful.com/e/... link. If an event line has no URL, do not link it and do not invent one.
- EVERY event you recommend MUST be a markdown link to its real URL from the data: [**Event Name**](exact-url-from-data). An event mentioned without its real link is a failure.
- NEVER invent numbers (guest counts, approval rates, capacity). Only cite figures present in that exact event's data line.
- If nothing in the data matches the request, say so plainly ("I don't see any events matching that in the data") and suggest a nearby category that IS in the data. Do NOT fabricate to fill the gap.

MATCHING — HOW TO LOOK THINGS UP:
- When the user asks about a specific person, company, brand, or venue, search the ENTIRE event line — the event NAME, the host field, AND the topics — not just the host column. Many events are co-hosted or sponsored by orgs that are named only in the title (e.g. "Fireside chat by A and B", "Event with A, B, and C", "X Cafe at Y"). Every org named in the title is a (co-)host or partner — count it.
- So if asked "is Acme hosting events?", an event titled "Dinner by Foo and Acme" counts as Acme hosting, even if the host field says "Foo".
- Match the LITERAL term the user typed against the literal text in the data. Do NOT assume they misspelled a more famous brand and silently answer about that other brand. "Verci" is not "Vercel"; "Notion" is not "Nothing". If a close-but-different name exists in the data, answer about the exact thing they asked. If both exist and it's ambiguous, briefly say so and cover the one they typed first.
- BE EXHAUSTIVE when asked about a specific company/host/venue/person/theme. Scan the WHOLE list top to bottom and surface EVERY event that matches — do not stop after the first 2-3 you happen to notice. If a query like "AWS events" matches 6 events, list all 6 (group or compress if many, but never silently drop a real match). Missing a relevant event is as bad as inventing one. The "default to 3-5 events" rule is for open-ended vibe questions ("what's fun thursday"), NOT for "show me all of X" — there, completeness wins.

AVOID OVER-RECOMMENDING THE SAME EVENTS:
- Do NOT keep pushing the same crowd-pleaser into unrelated answers. An event with a big guest count or a broad multi-topic title (e.g. "SaaS & AI Founder + Investor Rooftop Happy Hour" matches AI, SaaS, founders, investors, AND happy hours) is NOT automatically the right pick. Only include it when it genuinely fits THIS specific question.
- Relevance and fit to the exact ask come FIRST. Guest count / approval rate are tie-breakers and color, not the reason to pick an event. A perfectly-fitting 30-person event beats a loosely-related 600-person one.
- Vary your recommendations across a conversation. If you already recommended an event, don't lead with it again unless the user asks about it.

CONSULTATIVE MODE — when the user tells you who they are, what they're building, their role, or their goal (e.g. "I'm the founder of X selling cheap inference", "I'm an operator scouting deals", "I'm raising a pre-seed", "I'm hiring engineers"):
- This is your highest-value mode. Don't just dump a list — REASON like a sharp friend who knows the scene.
- OPEN with one line of strategy: what KIND of events fit this person and why (e.g. "you'll want the infra/builder-heavy tracks, not the big mixers — that's where compute-cost conversations actually happen").
- For EACH event, add a clause connecting it to THEIR specific goal — who's in the room and why that matches their pitch/need. Generic ("good networking") is a fail; specific ("Cloudflare's crowd is already obsessed with edge cost, so your cheap-inference angle lands") is the win.
- THEN close each rec with your unfair advantage — the live attendance data nobody else has: "180 going, 41% approval — competitive but worth applying." This is what separates you from every other event bot. Always include it when present.
- If they'll be around multiple days or want a plan, organize by day so it reads like a schedule they can act on.
- Match their vocabulary and domain — if they say "agentic infra" or "MCP" or "RL environments", speak it back. Sound like an insider, not a directory.
- Still respect the 8-event cap and ALWAYS link every event. Quality of fit > quantity.

QUERY-SPECIFIC GUIDANCE:
- "Harder to get into than YC" / acceptance rates: Sort by lowest approval rate among events with 100+ applicants. Compare rates to YC's ~2% for comedy. Mention the absurdity of needing to "apply" to a networking mixer.
- "Free food" / food events: Look for dinners, tastings, happy hours, rooftops, and events with "dinner", "food", "drinks", "brunch", "cocktail", "tasting" in the name. Prioritize ones with high guest counts (signal that the food is actually good). Mention the vibe — is it a sit-down dinner or standing with lukewarm pizza?
- "Angel check" / "get funded" / investor events: Look for VC/Investing tagged events, intimate dinners, and events hosted by known funds or angels. Prioritize smaller, more curated events (lower guest counts, application-based) over giant mixers — angels write checks at dinners, not at 800-person parties. Mention approval rates and guest counts as signals of how selective/intimate the crowd is.`;

function normalizeMessages(
  msgs: Array<Record<string, unknown>>
): Array<{ role: "user" | "assistant"; content: string }> {
  return msgs
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      let content = "";
      if (typeof m.content === "string") {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = (m.parts as Array<{ type: string; text?: string }>)
          .filter((p) => p.type === "text" && p.text)
          .map((p) => p.text)
          .join("");
      }
      return { role: m.role as "user" | "assistant", content };
    })
    .filter((m) => m.content.length > 0);
}

export async function POST(req: Request) {
  const { messages, eventContext, sessionId } = await req.json();

  const normalized = normalizeMessages(messages);

  // Query analytics: persist only the latest user question + timestamp.
  // No IP, no identifiers, no user id — anonymous usage logging only.
  const lastUserQuery = [...normalized]
    .reverse()
    .find((m) => m.role === "user");
  if (lastUserQuery) {
    const query = lastUserQuery.content.replace(/\s+/g, " ").slice(0, 500);
    // turn_index = how many user turns deep this message is (coarse signal,
    // not identifying). Helps distinguish first-asks from follow-ups.
    const turnIndex = normalized.filter((m) => m.role === "user").length - 1;

    console.log(`[nyc-chat] ${new Date().toISOString()} q=${JSON.stringify(query)}`);

    // Fire-and-forget: logging must NEVER block or break the chat response.
    // The try/catch guards against synchronous throws too (e.g. a missing
    // SUPABASE env var makes createAdminClient() throw immediately).
    if (query.length > 0) {
      try {
        // Two-arg .then handles both the resolved {error} and a rejection.
        // Supabase's builder is a PromiseLike (no .catch), so we can't chain.
        void createAdminClient()
          .from("nyc_chat_queries")
          .insert({
            query,
            turn_index: turnIndex,
            // Anonymous first-party session id (random UUID from the visitor's
            // localStorage) so turns group into conversations. No PII.
            session_id:
              typeof sessionId === "string" ? sessionId.slice(0, 64) : null,
          })
          .then(
            ({ error }) => {
              if (error) console.error("[nyc-chat] log insert failed:", error.message);
            },
            (e) => console.error("[nyc-chat] log insert threw:", e)
          );
      } catch (e) {
        console.error("[nyc-chat] logging skipped:", e);
      }
    }
  }

  // Guard: if the client didn't attach event data (network hiccup, bad
  // request), the model has NOTHING real to recommend. Without this it will
  // happily invent events and fake Partiful URLs. Force a graceful refusal
  // instead — never let it fabricate.
  const hasContext =
    typeof eventContext === "string" && eventContext.trim().length > 0;
  const systemPrompt = hasContext
    ? `${BASE_SYSTEM_PROMPT}\n\n${eventContext}`
    : `${BASE_SYSTEM_PROMPT}\n\nIMPORTANT: No event data is currently loaded. You have ZERO events to work with. Do NOT name, invent, or link any events or URLs whatsoever. Tell the user the live event data failed to load and ask them to refresh the page and try again. Keep it to one short sentence.`;

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    messages: [
      {
        role: "system",
        content: systemPrompt,
        // Cache the large system + event-context block (~67k tokens). It's
        // byte-identical for every user (deterministic build from the shared
        // data snapshot), so ONE cache write serves all visitors in a window.
        //
        // TTL must out-live the CONTENT, not just the traffic gaps. The event
        // context only changes when the data cache refreshes — now every 30 min
        // (events.ts CACHE_TTL). A 1h TTL comfortably spans that 30-min content
        // window even through traffic gaps, so the 67k block is written ~2x/hr
        // and every other request is a ~0.1x-price cache read. (Previously the
        // data refreshed every 5 min, so this block was rewritten ~12x/hr no
        // matter the TTL — the fix was lengthening the data window, not the TTL.)
        providerOptions: {
          anthropic: { cacheControl: { type: "ephemeral", ttl: "1h" } },
        },
      },
      ...normalized,
    ],
  });

  return result.toTextStreamResponse();
}
