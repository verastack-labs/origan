import { buildLlmsTxt } from "@/lib/llms";

/** The brief for answer engines. The text is built in `lib/llms.ts`, where it is tested. */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
