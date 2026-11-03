import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { resolve, relative, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const credentialPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\bAIza[A-Za-z0-9_-]{35}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
];
const binaryExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".ico", ".woff", ".woff2", ".mp4", ".pdf"]);
const excluded = new Set([".git", "node_modules", ".workspace", ".lovable", ".wrangler", ".netlify", ".output", "dist", "dist-ssr", ".nitro", ".tanstack", ".vinxi"]);

export function inspectText(text, { frontend = false, publicFile = false } = {}) {
  const issues = [];
  if (credentialPatterns.some((pattern) => pattern.test(text))) issues.push("credential-like value; remove and rotate if real");
  if (frontend && /(?:import\.meta\.env\.VITE_[A-Z0-9_]*(?:SECRET|TOKEN|PRIVATE|PASSWORD|API_KEY)|process\.env(?:\[|\.))/.test(text)) {
    issues.push("credential/environment access in browser-reachable source");
  }
  if (publicFile && /(?:process\.env|supabaseAdmin|BEGIN PRIVATE KEY)/.test(text)) issues.push("server-only data in public output");
  return issues;
}

function walk(directory, skip = new Set()) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name)) return [];
    const path = resolve(directory, entry.name);
    // Never follow symlinks to credentials or files outside the project.
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? walk(path, skip) : [path];
  });
}

export function auditProject(root, { sourceOnly = false } = {}) {
  const issues = [];
  const add = (path, message) => issues.push(`${relative(root, path)}: ${message}`);
  for (const path of walk(root, excluded)) {
    const name = basename(path);
    if ((name === ".env" || name.startsWith(".env.")) && name !== ".env.example") {
      add(path, "environment file present; keep outside source and deploy artifacts");
      continue; // Never read potentially secret-bearing environment files.
    }
    if (/\.(?:pem|key)$/.test(name)) { add(path, "private-key file must not be included"); continue; }
    if (binaryExtensions.has(extname(path)) || statSync(path).size > 5_000_000) continue;
    const rel = relative(root, path).replaceAll("\\", "/");
    const frontend = rel.startsWith("src/") && !/\.(?:server|functions|test|spec)\./.test(rel) && !["src/server.ts", "src/start.ts"].includes(rel) && !rel.startsWith("src/routes/api/");
    for (const issue of inspectText(readFileSync(path, "utf8"), { frontend, publicFile: rel.startsWith("public/") })) add(path, issue);
  }
  const ignorePath = resolve(root, ".gitignore");
  const ignore = existsSync(ignorePath) ? readFileSync(ignorePath, "utf8").split(/\r?\n/).map((line) => line.trim()) : [];
  if (!ignore.includes(".env") || !ignore.includes(".env.*")) add(ignorePath, "add .env and .env.* rules before deployment");
  if (!sourceOnly) {
    const publish = resolve(root, "dist");
    if (!existsSync(publish)) add(publish, "public build output missing; run the Netlify build first");
    else for (const path of walk(publish)) {
      if (/^\.env(?:\.|$)/.test(basename(path)) || /\.(?:pem|key|map)$/.test(path)) { add(path, "sensitive file or source map in public build"); continue; }
      if (!binaryExtensions.has(extname(path))) for (const issue of inspectText(readFileSync(path, "utf8"), { publicFile: true })) add(path, issue);
    }
    if (!existsSync(resolve(root, ".netlify/functions-internal/server/server.mjs"))) add(resolve(root, ".netlify/functions-internal"), "generated Netlify SSR entry missing");
  }
  return issues;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const issues = auditProject(process.cwd(), { sourceOnly: process.argv.includes("--source-only") });
  if (issues.length) {
    // Report paths and categories only, never the matching credential value.
    console.error("Security checks blocked deployment:\n" + issues.join("\n"));
    process.exitCode = 1;
  } else console.log("Security checks passed for inspected files. This is not a guarantee against unknown credential formats.");
}