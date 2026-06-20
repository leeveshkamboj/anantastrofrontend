/**
 * Merge missing keys from messages/en.json into other locale files.
 * Preserves existing translations; fills gaps from English (optionally machine-translated).
 *
 * Usage:
 *   node scripts/sync-message-keys.mjs              # English fallback only
 *   node scripts/sync-message-keys.mjs --translate    # translate new keys (needs network)
 *   node scripts/sync-message-keys.mjs --locale=hi    # single locale
 */
import { readFileSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { translate } from "google-translate-api-x"

const __dirname = dirname(fileURLToPath(import.meta.url))
const MESSAGES = join(__dirname, "..", "messages")

const LOCALES = [
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
]

const CHUNK = 28
const DELAY_MS = 120

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function collectStrings(obj, prefix, out) {
  if (typeof obj === "string") {
    out.push({ path: prefix, value: obj })
    return
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      const p = prefix ? `${prefix}.${k}` : k
      collectStrings(obj[k], p, out)
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectStrings(item, `${prefix}[${i}]`, out))
  }
}

function setPath(root, path, value) {
  const parts = path.split(".")
  let cur = root
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

function getPath(root, path) {
  const parts = path.split(".")
  let cur = root
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

/** Add keys present in `source` but missing in `target`. Returns list of added leaf paths. */
function mergeMissing(target, source, prefix = "") {
  const added = []
  for (const key of Object.keys(source)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (!(key in target)) {
      target[key] = structuredClone(source[key])
      if (typeof source[key] === "string") {
        added.push(path)
      } else {
        const leaves = []
        collectStrings(source[key], path, leaves)
        leaves.forEach((p) => added.push(p.path))
      }
    } else if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof target[key] === "object" &&
      target[key] !== null
    ) {
      added.push(...mergeMissing(target[key], source[key], path))
    }
  }
  return added
}

function shouldKeepEnglish(path) {
  return path.startsWith("nav.lang_")
}

async function translateChunk(strings, to) {
  for (let tries = 0; tries < 4; tries++) {
    try {
      const res = await translate(strings, { from: "en", to, forceTo: true })
      const arr = Array.isArray(res) ? res : [res]
      return arr.map((r) => (typeof r === "string" ? r : r?.text ?? ""))
    } catch {
      await sleep(800 * (tries + 1))
      if (tries === 3) throw new Error(`translate failed for ${to}`)
    }
  }
}

async function translatePaths(localeObj, paths, to) {
  const translatable = paths.filter((p) => !shouldKeepEnglish(p))
  for (let i = 0; i < translatable.length; i += CHUNK) {
    const slice = translatable.slice(i, i + CHUNK)
    const raw = slice.map((p) => getPath(localeObj, p))
    const translated = await translateChunk(raw, to)
    slice.forEach((p, j) => {
      if (translated[j]) setPath(localeObj, p, translated[j])
    })
    process.stdout.write(`  ${to}: ${Math.min(i + CHUNK, translatable.length)}/${translatable.length}\r`)
    await sleep(DELAY_MS)
  }
  if (translatable.length) console.log()
}

async function main() {
  const translateNew = process.argv.includes("--translate")
  const only = process.argv.find((a) => a.startsWith("--locale="))?.split("=")[1]
  const targets = only ? [only] : LOCALES

  const en = JSON.parse(readFileSync(join(MESSAGES, "en.json"), "utf8"))

  for (const locale of targets) {
    if (!LOCALES.includes(locale) && only) {
      console.error("Unknown locale:", locale)
      process.exit(1)
    }

    const file = join(MESSAGES, `${locale}.json`)
    const existing = JSON.parse(readFileSync(file, "utf8"))
    const added = mergeMissing(existing, en)

    if (added.length === 0) {
      console.log(`${locale}: already in sync`)
      continue
    }

    console.log(`${locale}: added ${added.length} keys`)

    if (translateNew) {
      console.log(`  translating ${added.filter((p) => !shouldKeepEnglish(p)).length} strings…`)
      await translatePaths(existing, added, locale)
    }

    writeFileSync(file, `${JSON.stringify(existing, null, 2)}\n`, "utf8")
  }

  console.log("Done.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
