import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

export async function middleware(request: NextRequest) {
  console.log("[middleware]", request.nextUrl.pathname);

  // Only run Supabase session refresh if real credentials are configured
  if (isSupabaseConfigured) {
    try {
      const supabaseResponse = await updateSession(request);
      const intlResponse = intlMiddleware(request);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value);
      });
      return intlResponse;
    } catch {
      // Fall through to intl-only middleware
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
