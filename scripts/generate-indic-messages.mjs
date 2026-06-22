/**
 * Fills `messages/{hi,bn,ta,...}.json` by machine-translating `messages/en.json`.
 *
 * Run:
 *   GOOGLE_TRANSLATE_API_KEY=... npm run messages:indic
 *   npm run messages:indic -- --locale=hi
 *
 * Uses Google Cloud Translation API v2 when GOOGLE_TRANSLATE_API_KEY is set
 * (also reads backend/.env). Falls back to google-translate-api-x otherwise.
 * After generation, run: npm run messages:fix-icu
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { translate as translateUnofficial } from "google-translate-api-x";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MESSAGES = join(ROOT, "messages");
const BACKEND_ENV = join(ROOT, "..", "backend", ".env");

/** All routed locales except English. */
const TARGETS = [
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
];

const CHUNK_GOOGLE = 100;
const CHUNK_UNOFFICIAL = 28;
const DELAY_MS = 80;
const FROM = "en";

/** Leaf paths whose English value should be copied verbatim (not translated). */
const PRESERVE_PATH_SUFFIXES = [
  "reportLanguageHinglish",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

function shouldPreserve(path, enValue) {
  const leaf = path.split(".").pop() ?? path;
  if (leaf.startsWith("lang_") && path.startsWith("nav.")) return true;
  if (PRESERVE_PATH_SUFFIXES.includes(leaf)) return true;
  // Skip empty / punctuation-only strings.
  if (!enValue.trim()) return true;
  return false;
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

async function translateChunkGoogle(strings, to, apiKey) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
  const attempt = async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        q: strings,
        source: FROM,
        target: to,
        format: "text",
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const err = new Error(`Google Translate HTTP ${res.status}: ${body.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    const rows = data?.data?.translations ?? [];
    return rows.map((row) => row?.translatedText ?? "");
  };

  for (let tries = 0; tries < 5; tries++) {
    try {
      return await attempt();
    } catch (e) {
      const wait = e.status === 429 ? 2000 * (tries + 1) : 800 * (tries + 1);
      await sleep(wait);
      if (tries === 4) throw e;
    }
  }
}

async function translateChunkUnofficial(strings, to) {
  const attempt = async () => {
    const res = await translateUnofficial(strings, { from: FROM, to, forceTo: true });
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

async function buildLocale(enObj, to, { apiKey, chunkSize, translateChunk }) {
  const pairs = [];
  collectStrings(enObj, "", pairs);
  const out = JSON.parse(JSON.stringify(enObj));

  const toTranslate = [];
  const toTranslateIdx = [];
  pairs.forEach((p, idx) => {
    if (shouldPreserve(p.path, p.value)) {
      setPath(out, p.path, p.value);
      return;
    }
    toTranslate.push(p);
    toTranslateIdx.push(idx);
  });

  for (let i = 0; i < toTranslate.length; i += chunkSize) {
    const slice = toTranslate.slice(i, i + chunkSize);
    const raw = slice.map((p) => p.value);
    const translated = await translateChunk(raw, to);
    slice.forEach((p, j) => {
      const v = translated[j] ?? p.value;
      setPath(out, p.path, v);
    });
    const done = Math.min(i + chunkSize, toTranslate.length);
    process.stdout.write(`  ${to}: ${done}/${toTranslate.length} (of ${pairs.length})\r`);
    await sleep(DELAY_MS);
  }

  console.log(`\n  ${to}: wrote ${pairs.length} strings (${toTranslate.length} translated)`);
  return out;
}

async function main() {
  loadEnvFile(BACKEND_ENV);
  loadEnvFile(join(ROOT, ".env"));

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  const provider = apiKey ? "google" : "unofficial";
  const chunkSize = apiKey ? CHUNK_GOOGLE : CHUNK_UNOFFICIAL;
  const translateChunk = apiKey
    ? (strings, to) => translateChunkGoogle(strings, to, apiKey)
    : (strings, to) => translateChunkUnofficial(strings, to);

  if (provider === "google") {
    console.log("Using Google Cloud Translation API (GOOGLE_TRANSLATE_API_KEY)");
  } else {
    console.warn(
      "GOOGLE_TRANSLATE_API_KEY not set — using google-translate-api-x (unofficial, may rate-limit)",
    );
  }

  const only = process.argv.find((a) => a.startsWith("--locale="))?.split("=")[1];
  const targets = only ? [only] : TARGETS;

  const enRaw = readFileSync(join(MESSAGES, "en.json"), "utf8");
  const enObj = JSON.parse(enRaw);

  mkdirSync(MESSAGES, { recursive: true });

  const opts = { apiKey, chunkSize, translateChunk };

  for (const to of targets) {
    if (!TARGETS.includes(to)) {
      console.error("Unknown locale:", to);
      process.exit(1);
    }
    console.log(`Translating → ${to}…`);
    const out = await buildLocale(enObj, to, opts);
    writeFileSync(join(MESSAGES, `${to}.json`), `${JSON.stringify(out, null, 2)}\n`, "utf8");
  }
  console.log("Done. Run: npm run messages:fix-icu");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
