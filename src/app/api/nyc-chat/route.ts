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
- Default to 3-5 events per response. Quality over quantity. Only give more if the user explicitly asks for a longer list.
- Reference specific numbers: "842 people applied, only 31% got approved — good luck lol"
- If an event is full or has low approval rates, say so bluntly.
- Keep responses SHORT. 2-3 sentences per event rec. No fluff intros.
- ALWAYS link event names to their Partiful URL using markdown links: [**Event Name**](https://partiful.com/...). The URL is included at the end of each event's data line.
- You can be funny and irreverent but stay helpful.
- Don't use bullet points for every response — mix it up with numbered lists and prose.
- Jump straight into recommendations. No "Great question!" or "Let me look..." — just start with the goods.

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
  const { messages, eventContext } = await req.json();

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

    // Fire-and-forget: never block or fail the chat response on a logging error.
    if (query.length > 0) {
      void createAdminClient()
        .from("nyc_chat_queries")
        .insert({ query, turn_index: turnIndex })
        .then(({ error }) => {
          if (error) console.error("[nyc-chat] log insert failed:", error.message);
        });
    }
  }

  const systemPrompt = eventContext
    ? `${BASE_SYSTEM_PROMPT}\n\n${eventContext}`
    : BASE_SYSTEM_PROMPT;

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    messages: [
      {
        role: "system",
        content: systemPrompt,
        // Cache the large system + event-context block. The first message
        // writes the cache; every follow-up in the ~5-min window hits it,
        // cutting time-to-first-token (and cost) dramatically.
        providerOptions: {
          anthropic: { cacheControl: { type: "ephemeral" } },
        },
      },
      ...normalized,
    ],
  });

  return result.toTextStreamResponse();
}
