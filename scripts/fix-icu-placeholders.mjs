/**
 * Machine translation often corrupts ICU placeholders ({year} → {वर्ष}).
 * Re-sync `{…}` segments in locale strings with placeholder tokens from en.json in order.
 *
 * Run: node scripts/fix-icu-placeholders.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES = join(__dirname, "../messages");

const TARGETS = ["bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur"];

/** Placeholders as they appear in en.json (ASCII identifiers only). */
function extractEnPlaceholders(enStr) {
  const tokens = [];
  const re = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;
  let m;
  while ((m = re.exec(enStr))) tokens.push(m[0]);
  return tokens;
}

function syncPlaceholders(enStr, locStr) {
  const tokens = extractEnPlaceholders(enStr);
  if (tokens.length === 0) return locStr;
  let i = 0;
  return locStr.replace(/\{[^}]+\}/g, () => {
    const t = tokens[i++];
    return t !== undefined ? t : "{}";
  });
}

function fixTree(en, loc, path = "") {
  if (typeof en === "string" && typeof loc === "string") {
    return syncPlaceholders(en, loc);
  }
  if (
    en &&
    typeof en === "object" &&
    !Array.isArray(en) &&
    loc &&
    typeof loc === "object" &&
    !Array.isArray(loc)
  ) {
    const out = { ...loc };
    for (const k of Object.keys(en)) {
      if (k in loc) {
        out[k] = fixTree(en[k], loc[k], path ? `${path}.${k}` : k);
      }
    }
    return out;
  }
  return loc;
}

const en = JSON.parse(readFileSync(join(MESSAGES, "en.json"), "utf8"));

for (const loc of TARGETS) {
  const p = join(MESSAGES, `${loc}.json`);
  const data = JSON.parse(readFileSync(p, "utf8"));
  const fixed = fixTree(en, data);
  writeFileSync(p, `${JSON.stringify(fixed, null, 2)}\n`, "utf8");
  console.log("fixed", loc);
}

console.log("Done.");
