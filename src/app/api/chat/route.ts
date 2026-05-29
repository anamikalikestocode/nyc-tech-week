import { streamText, stepCountIs } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  baseURL: "https://api.anthropic.com/v1",
});
import { getSystemPrompt } from "@/lib/ai/system-prompt";
import { aiTools } from "@/lib/ai/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, locale = "en" } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: getSystemPrompt(locale as "en" | "fr"),
    messages,
    tools: aiTools,
    stopWhen: stepCountIs(5),
  });

  return result.toTextStreamResponse();
}
