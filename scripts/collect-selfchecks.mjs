// Node 20+
// Usage: BASE_URL=http://localhost:3000 npm run collect:selfcheck

import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const MODELS = ["claude-code", "codex", "gemini", "github-gpt"];
const OUT_DIR = "artifacts";

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { "accept": "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

async function readSecurityFlag() {
  try {
    const txt = await fs.readFile("security_check.txt", "utf8");
    const val = txt.trim();
    if (val !== "SECRETS_OK" && val !== "SECRETS_FAIL") {
      return { present: true, value: val, valid: false };
    }
    return { present: true, value: val, valid: true };
  } catch {
    return { present: false, value: null, valid: false };
  }
}

async function main() {
  await ensureDir(OUT_DIR);
  const summary = [];
  for (const model of MODELS) {
    const url = `${BASE_URL}/${model}/api/selfcheck`;
    const outfile = path.join(OUT_DIR, `selfcheck-${model}.json`);
    try {
      const data = await fetchJSON(url);
      await fs.writeFile(outfile, JSON.stringify(data, null, 2), "utf8");
      summary.push({ model, ok: true, file: outfile, url });
      console.log(`✔ Saved ${outfile}`);
    } catch (err) {
      summary.push({ model, ok: false, error: String(err), url });
      console.error(`✖ Failed for ${model}: ${err}`);
    }
  }

  const security = await readSecurityFlag();
  const combined = {
    baseUrl: BASE_URL,
    collectedAt: new Date().toISOString(),
    security,
    summary
  };
  const combinedFile = path.join(OUT_DIR, "selfchecks-summary.json");
  await fs.writeFile(combinedFile, JSON.stringify(combined, null, 2), "utf8");
  console.log(`➜ Wrote ${combinedFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
