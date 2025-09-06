// Node 18+ recommended; Node 20/22 OK.
// Usage examples:
//   BASE_URL=http://localhost:3000 npm run judge
//   npm run judge -- --base http://localhost:3000

import fs from "node:fs/promises";
import path from "node:path";

// --- Polyfill fetch for Node <18 (optional safeguard) ---
if (typeof fetch !== "function") {
  try {
    const { fetch: undiciFetch } = await import("undici");
    globalThis.fetch = undiciFetch;
    console.log("[judge] fetch polyfilled via undici");
  } catch (e) {
    console.error("[judge] fetch is not available and undici is not installed.");
    console.error("        Install it with: npm i undici --save-dev");
    process.exit(1);
  }
}

// -------------------- Config --------------------
const MODELS = ["claude-code", "codex", "gemini", "github-gpt"];
const OUT_DIR = "artifacts";
const MODEL_DIR = (m) => path.join("src", "app", m);

// -------------------- Helpers --------------------
function parseBase() {
  const idx = process.argv.indexOf("--base");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.env.BASE_URL || "http://localhost:3000";
}
const BASE_URL = parseBase();

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
  console.log(`[judge] ensured dir: ${dir}`);
}

async function fetchJSON(url) {
  console.log(`[judge] GET ${url}`);
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

// -------------------- Security (global & per-model) --------------------
async function readGlobalSecurity() {
  try {
    const txt = await fs.readFile("security_check.txt", "utf8");
    const val = (txt || "").trim();
    const pass = val === "SECRETS_OK";
    console.log(`[judge] root security_check.txt: ${val || "MISSING/EMPTY"} (pass=${pass})`);
    return { present: true, value: val, pass };
  } catch {
    console.warn("[judge] root security_check.txt not found");
    return { present: false, value: null, pass: false };
  }
}

async function readModelSecurityFlag(model) {
  const p = path.join(MODEL_DIR(model), "security_check.txt");
  try {
    const txt = await fs.readFile(p, "utf8");
    const val = (txt || "").trim();
    const pass = val === "SECRETS_OK";
    return { present: true, value: val, pass, file: p };
  } catch {
    return { present: false, value: null, pass: false, file: p };
  }
}

// Simple static scan inside a model folder to catch common leaks
async function scanModelSecurity(model) {
  const dir = MODEL_DIR(model);
  const suspicious = { files: [], nextPublic: false, owmClientInClient: false };

  const nextPublicRe = /NEXT_PUBLIC_/;
  const owmUrlRe = /https?:\/\/api\.openweathermap\.org/i;

  async function walk(d) {
    let entries = [];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e.name)) continue;

      let content = "";
      try {
        content = await fs.readFile(full, "utf8");
      } catch {
        continue;
      }

      if (nextPublicRe.test(content)) {
        suspicious.nextPublic = true;
        suspicious.files.push({ file: full, issue: "NEXT_PUBLIC_* usage (exposes secrets)" });
      }

      if (owmUrlRe.test(content)) {
        // If the file path is not within …/<model>/api/**, flag as likely client/server component misuse
        const apiPath = path.join(model, "api") + path.sep;
        const norm = full.replace(/\\/g, "/");
        const isApi = norm.includes(`/${apiPath.replace(/\\/g, "/")}`);
        if (!isApi) {
          suspicious.owmClientInClient = true;
          suspicious.files.push({ file: full, issue: "Direct OpenWeatherMap call outside /api" });
        }
      }
    }
  }

  await walk(dir);
  return suspicious;
}

// -------------------- Scoring --------------------
function scoreOne(selfcheck, securityPass) {
  const f = selfcheck.functionality || {};
  const w = selfcheck.weatherLogic || {};
  const cq = selfcheck.codeQuality || {};
  const ux = selfcheck.ux || {};
  const p = selfcheck.performance || {};

  // Functionality 40
  let functionality = 0;
  functionality += f.citySelectorHas25 ? 5 : 0;
  functionality += f.defaultCityIsHelsinki ? 3 : 0;
  functionality += f.weatherApiIntegrated ? 10 : 0;
  functionality += f.overpassIntegrated ? 10 : 0;
  const range = f.radiusRangeKm || {};
  functionality += range.min === 1 && range.max === 10 && range.default === 3 ? 4 : 0;
  const pag = f.pagination || {};
  functionality += pag.works && pag.pageSize === 10 && pag.maxResults === 30 ? 5 : 0;
  functionality += f.prefsPersisted ? 3 : 0;

  // Weather logic bonus (cap +10; cap total 40)
  const weatherLogicBonus =
    (w.coldHandled ? 2 : 0) +
    (w.moderateHandled ? 2 : 0) +
    (w.warmHandled ? 2 : 0) +
    (w.rainHandled ? 2 : 0) +
    (w.windHandled ? 2 : 0);
  functionality = Math.min(40, functionality + Math.min(10, weatherLogicBonus));

  // Code Quality 25
  let codeQuality = 0;
  codeQuality += cq.usesTypescript ? 8 : 0;
  codeQuality += cq.separationApiUiLogic ? 7 : 0;
  codeQuality += cq.componentsHooksUtilsSplit ? 5 : 0;
  codeQuality += cq.noDuplicateCodeNoticed ? 5 : 0;
  codeQuality = Math.min(25, codeQuality);

  // UX 20
  let uxScore = 0;
  uxScore += ux.responsiveMobileFirst ? 7 : 0;
  uxScore += ux.loadingSkeletons ? 5 : 0;
  uxScore += ux.errorMessages ? 5 : 0;
  uxScore += ux.keyboardNavigable ? 3 : 0;
  uxScore = Math.min(20, uxScore);

  // Performance 15
  let performance = 0;
  performance += typeof p.weatherCachedMinutes === "number" && p.weatherCachedMinutes >= 30 ? 5 : 0;
  performance += p.radiusDebounced ? 4 : 0;
  performance += p.overpassRateLimited ? 4 : 0;
  performance += p.noRedundantCallsObserved ? 2 : 0;
  performance = Math.min(15, performance);

  const total = functionality + codeQuality + uxScore + performance;

  const strengths = [];
  if (f.weatherApiIntegrated) strengths.push("Weather API integrated");
  if (f.overpassIntegrated) strengths.push("Overpass integrated");
  if (ux.responsiveMobileFirst) strengths.push("Responsive layout");
  if (p.radiusDebounced) strengths.push("Debounced radius");
  if (cq.usesTypescript) strengths.push("TypeScript used");

  const improvements = [];
  if (!securityPass) improvements.push("Secrets exposure / not strictly server-side");
  if (!pag.works) improvements.push("Pagination not working or incorrect");
  if (!(range.min === 1 && range.max === 10 && range.default === 3)) improvements.push("Radius control out of spec");
  if (!ux.loadingSkeletons) improvements.push("Missing loading states");
  if (!ux.errorMessages) improvements.push("Missing actionable error messages");

  return {
    securityPass,
    scores: { functionality, codeQuality, ux: uxScore, performance },
    total,
    summary: { strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3) }
  };
}

// -------------------- Main --------------------
async function judge() {
  console.log(`[judge] BASE_URL = ${BASE_URL}`);
  await ensureDir(OUT_DIR);

  const globalSecurity = await readGlobalSecurity();

  const results = [];
  for (const model of MODELS) {
    const url = `${BASE_URL}/${model}/api/selfcheck`;
    const outfile = path.join(OUT_DIR, `selfcheck-${model}.json`);

    // Per-model security flag & static scan
    const perModelFlag = await readModelSecurityFlag(model);
    const suspicious = await scanModelSecurity(model);

    let selfcheck = null;
    let ok = true;
    let error = null;
    try {
      selfcheck = await fetchJSON(url);
      await fs.writeFile(outfile, JSON.stringify(selfcheck, null, 2), "utf8");
      console.log(`[judge] ✔ saved ${outfile}`);
    } catch (e) {
      ok = false;
      error = String(e);
      console.warn(`[judge] ✖ ${model}: ${e}`);
    }

    // If selfcheck missing, still record a result (score 0)
    if (!ok || !selfcheck) {
      const securityPass =
        perModelFlag.pass && globalSecurity.pass && !suspicious.nextPublic && !suspicious.owmClientInClient;

      results.push({
        model,
        ok: false,
        error,
        url,
        security: { global: globalSecurity, perModelFlag, suspicious },
        securityPass,
        scores: { functionality: 0, codeQuality: 0, ux: 0, performance: 0 },
        total: 0,
        summary: { strengths: [], improvements: ["Selfcheck endpoint not reachable"] }
      });
      continue;
    }

    const securityPass =
      perModelFlag.pass && globalSecurity.pass && !suspicious.nextPublic && !suspicious.owmClientInClient;

    const scored = scoreOne(selfcheck, securityPass);

    results.push({
      model,
      ok: true,
      url,
      security: { global: globalSecurity, perModelFlag, suspicious },
      ...scored
    });
  }

  const report = {
    baseUrl: BASE_URL,
    collectedAt: new Date().toISOString(),
    results,
    ranking: [...results].sort((a, b) => b.total - a.total).map((r) => r.model)
  };

  // Write JSON report
  const jsonPath = path.join(OUT_DIR, "judge-report.json");
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");

  // Write Markdown report
  const mdLines = [];
  mdLines.push(`# WeatherEats Judge Report`);
  mdLines.push(`Base URL: ${BASE_URL}`);
  mdLines.push(`Collected: ${report.collectedAt}`);
  mdLines.push(``);

  for (const r of results) {
    mdLines.push(`## ${r.model}`);
    if (!r.ok) {
      mdLines.push(`- Status: ❌ Failed to fetch selfcheck (${r.error})`);
      const sec = r.security || {};
      mdLines.push(`- Security: ${r.securityPass ? "✅ Pass" : "❌ Fail"}`);
      if (sec.global) mdLines.push(`  - Global: ${sec.global.pass ? "OK" : "FAIL"}`);
      if (sec.perModelFlag) {
        mdLines.push(`  - Per-model flag: ${sec.perModelFlag.pass ? "OK" : "MISSING/FAIL"}`);
        if (sec.perModelFlag.file) mdLines.push(`    • ${sec.perModelFlag.file}`);
      }
      if (sec.suspicious?.files?.length) {
        mdLines.push(`  - Suspicious findings:`);
        for (const f of sec.suspicious.files.slice(0, 5)) {
          mdLines.push(`    • ${f.issue} → ${f.file}`);
        }
      }
      mdLines.push(``);
      continue;
    }

    mdLines.push(`- Security: ${r.securityPass ? "✅ Pass" : "❌ Fail"}`);
    if (r.security?.global) mdLines.push(`  - Global: ${r.security.global.pass ? "OK" : "FAIL"}`);
    if (r.security?.perModelFlag) {
      mdLines.push(`  - Per-model flag: ${r.security.perModelFlag.pass ? "OK" : "MISSING/FAIL"}`);
      if (r.security.perModelFlag.file) mdLines.push(`    • ${r.security.perModelFlag.file}`);
    }
    if (r.security?.suspicious?.files?.length) {
      mdLines.push(`  - Suspicious findings:`);
      for (const f of r.security.suspicious.files.slice(0, 5)) {
        mdLines.push(`    • ${f.issue} → ${f.file}`);
      }
    }
    mdLines.push(`- Scores: Functionality ${r.scores.functionality}/40, Code ${r.scores.codeQuality}/25, UX ${r.scores.ux}/20, Perf ${r.scores.performance}/15`);
    mdLines.push(`- Total: **${r.total}/100**`);
    mdLines.push(`- Strengths: ${r.summary.strengths.join("; ") || "—"}`);
    mdLines.push(`- Improvements: ${r.summary.improvements.join("; ") || "—"}`);
    mdLines.push(``);
  }

  mdLines.push(`---`);
  mdLines.push(`**Ranking:** ${report.ranking.join(" > ") || "No valid results"}`);

  const mdPath = path.join(OUT_DIR, "judge-report.md");
  await fs.writeFile(mdPath, mdLines.join("\n"), "utf8");

  console.log(`\n[judge] ✔ Wrote ${jsonPath}`);
  console.log(`[judge] ✔ Wrote ${mdPath}`);
}

judge().catch((e) => {
  console.error("[judge] fatal error:", e);
  process.exit(1);
});
