import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { deepMerge } from "@/lib/deepMerge";
import enMessages from "../messages/en.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  if (locale === routing.defaultLocale) {
    return {
      locale,
      messages: enMessages,
    };
  }

  const override = (await import(`../messages/${locale}.json`)).default as Record<
    string,
    unknown
  >;

  const messages =
    Object.keys(override).length === 0
      ? enMessages
      : (deepMerge(enMessages, override) as typeof enMessages);

  return {
    locale,
    messages,
  };
});
