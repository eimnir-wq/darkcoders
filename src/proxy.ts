import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, detectLocale, isLocale, LOCALE_STORAGE_KEY } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(LOCALE_STORAGE_KEY)?.value;

  if (!isLocale(existing)) {
    const header = request.headers.get("accept-language") ?? "";
    const candidates = header
      .split(",")
      .map((part) => part.split(";")[0]?.trim())
      .filter(Boolean);
    const locale = candidates.length ? detectLocale(candidates) : defaultLocale;
    response.cookies.set(LOCALE_STORAGE_KEY, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|icon|apple-icon).*)"],
};
