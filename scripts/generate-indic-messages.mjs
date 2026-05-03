/**
 * Fills `messages/{bn,ta,...}.json` by machine-translating `messages/en.json`.
 * Run: node scripts/generate-indic-messages.mjs
 * Requires network. Uses google-translate-api-x (unofficial; may rate-limit).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { translate } from "google-translate-api-x";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MESSAGES = join(ROOT, "messages");

const TARGETS = [
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
];

const CHUNK = 28;
const DELAY_MS = 120;
const FROM = "en";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Deterministic string leaf collection (object key order = JSON parse order). */
function collectStrings(obj, prefix, out) {
  if (typeof obj === "string") {
    out.push({ path: prefix, value: obj });
    return;
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      collectStrings(obj[k], p, out);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectStrings(item, `${prefix}[${i}]`, out));
  }
}

function setPath(root, path, value) {
  const parts = path.split(".");
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

async function translateChunk(strings, to) {
  const attempt = async () => {
    const res = await translate(strings, { from: FROM, to, forceTo: true });
    const arr = Array.isArray(res) ? res : [res];
    return arr.map((r) => (typeof r === "string" ? r : r?.text ?? ""));
  };
  for (let tries = 0; tries < 4; tries++) {
    try {
      return await attempt();
    } catch (e) {
      await sleep(800 * (tries + 1));
      if (tries === 3) throw e;
    }
  }
}

async function buildLocale(enObj, to) {
  const pairs = [];
  collectStrings(enObj, "", pairs);
  const out = JSON.parse(JSON.stringify(enObj));

  for (let i = 0; i < pairs.length; i += CHUNK) {
    const slice = pairs.slice(i, i + CHUNK);
    const raw = slice.map((p) => p.value);
    const translated = await translateChunk(raw, to);
    slice.forEach((p, j) => {
      const v = translated[j] ?? p.value;
      setPath(out, p.path, v);
    });
    process.stdout.write(`  ${to}: ${Math.min(i + CHUNK, pairs.length)}/${pairs.length}\r`);
    await sleep(DELAY_MS);
  }
  // Keep native language names universal (do not machine-translate labels).
  if (enObj.nav && out.nav) {
    for (const k of Object.keys(enObj.nav)) {
      if (k.startsWith("lang_")) out.nav[k] = enObj.nav[k];
    }
  }
  console.log(`\n  ${to}: wrote ${pairs.length} strings`);
  return out;
}

async function main() {
  const only = process.argv.find((a) => a.startsWith("--locale="))?.split("=")[1];
  const targets = only ? [only] : TARGETS;

  const enRaw = readFileSync(join(MESSAGES, "en.json"), "utf8");
  const enObj = JSON.parse(enRaw);

  mkdirSync(MESSAGES, { recursive: true });

  for (const to of targets) {
    if (!TARGETS.includes(to) && only) {
      console.error("Unknown locale:", to);
      process.exit(1);
    }
    console.log(`Translating → ${to}…`);
    const out = await buildLocale(enObj, to);
    writeFileSync(join(MESSAGES, `${to}.json`), `${JSON.stringify(out, null, 2)}\n`, "utf8");
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
