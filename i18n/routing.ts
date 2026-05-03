import { defineRouting } from "next-intl/routing";

/** BCP 47 language tags for India + English default. Messages merge over `en.json` per locale. */
export const routing = defineRouting({
  locales: [
    "en",
    "hi",
    "bn",
    "ta",
    "te",
    "mr",
    "gu",
    "kn",
    "ml",
    "pa",
    "or",
    "as",
    "ur",
  ],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
