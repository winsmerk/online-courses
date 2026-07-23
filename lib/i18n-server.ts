import { cookies } from "next/headers";
import {
  LOCALE_COOKIE,
  normalizeLocale,
  translate,
  type Locale,
} from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getServerI18n() {
  const locale = await getLocale();
  return {
    locale,
    t: (key: string, variables?: Record<string, string | number>) =>
      translate(locale, key, variables),
  };
}
