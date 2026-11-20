/**
 * Syncs Appwrite env vars into Cloudflare Worker (wattly) without dashboard clicking.
 * Requires: CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
 *
 * Usage:
 *   node --env-file=.env.local --env-file=.env.cloudflare scripts/sync-cloudflare-vars.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i);
    const value = trimmed.slice(i + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env.cloudflare"));

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const workerName = process.env.CLOUDFLARE_WORKER_NAME || "wattly";

if (!accountId || !token) {
  console.error(
    "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN.\n" +
      "Create .env.cloudflare with those values (gitignored), then re-run.",
  );
  process.exit(1);
}

const plainVars = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    "https://fra.cloud.appwrite.io/v1",
  NEXT_PUBLIC_APPWRITE_PROJECT_ID:
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad515c80023f767eed7",
  NEXT_PUBLIC_APPWRITE_DATABASE_ID:
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly",
};

async function cf(path, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(JSON.stringify(json.errors || json, null, 2));
  }
  return json.result;
}

async function putSecret(name, value) {
  // Wrangler-compatible secret upload via API multipart is awkward;
  // use Workers Scripts Settings secrets endpoint.
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}/secrets`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, text: value, type: "secret_text" }),
    },
  );
  const json = await res.json();
  if (!json.success) {
    throw new Error(`Secret ${name}: ${JSON.stringify(json.errors || json)}`);
  }
  console.log(`Secret set: ${name}`);
}

async function main() {
  console.log(`Syncing vars to worker: ${workerName}`);

  // Patch worker settings vars (non-secret)
  // Get current script settings if possible; otherwise print wrangler commands.
  try {
    await cf(`/accounts/${accountId}/workers/scripts/${workerName}/settings`, {
      method: "PATCH",
      body: JSON.stringify({
        bindings: Object.entries(plainVars).map(([name, text]) => ({
          type: "plain_text",
          name,
          text,
        })),
      }),
    });
    console.log("Plain text bindings updated.");
  } catch (error) {
    console.warn("Could not PATCH settings bindings:", error.message);
    console.warn("Falling back to documenting wrangler secret/var commands.");
  }

  if (process.env.APPWRITE_API_KEY) {
    await putSecret("APPWRITE_API_KEY", process.env.APPWRITE_API_KEY);
  } else {
    console.warn("APPWRITE_API_KEY missing — skipped secret upload.");
  }

  // Also try Workers Builds project variables if BUILD project name exists
  try {
    const projects = await cf(
      `/accounts/${accountId}/builds/workers?search=${encodeURIComponent(workerName)}`,
    );
    console.log("Builds search result keys:", Object.keys(projects || {}));
  } catch (error) {
    console.warn("Builds API lookup skipped:", error.message);
  }

  console.log("Done. Public Appwrite vars are also in wrangler.jsonc for builds.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
