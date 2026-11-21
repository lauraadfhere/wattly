/**
 * Syncs Appwrite + Cloudinary env into Cloudflare Worker (wattly).
 * Prefer: wrangler OAuth session (yarn cf:sync-vars) — no API token required.
 * Optional: CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID in .env.cloudflare
 *
 * Usage:
 *   yarn cf:sync-vars
 *   node --env-file=.env.local scripts/sync-cloudflare-vars.mjs
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i);
    let value = trimmed.slice(i + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env.production"));
loadEnvFile(resolve(process.cwd(), ".env.cloudflare"));

const accountId =
  process.env.CLOUDFLARE_ACCOUNT_ID || "1b0d0da111bf8727b19e095d1d1e9694";
const token = process.env.CLOUDFLARE_API_TOKEN;
const workerName = process.env.CLOUDFLARE_WORKER_NAME || "wattly";

const plainVars = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    "https://fra.cloud.appwrite.io/v1",
  NEXT_PUBLIC_APPWRITE_PROJECT_ID:
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad515c80023f767eed7",
  NEXT_PUBLIC_APPWRITE_DATABASE_ID:
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly",
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "dp5g9tinm",
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "wattly_avatars",
};

const secrets = {
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};

function ensureCloudflareEnvFile() {
  const path = resolve(process.cwd(), ".env.cloudflare");
  if (existsSync(path)) return;
  writeFileSync(
    path,
    [
      `CLOUDFLARE_ACCOUNT_ID=${accountId}`,
      "CLOUDFLARE_API_TOKEN=",
      `CLOUDFLARE_WORKER_NAME=${workerName}`,
      "",
    ].join("\n"),
  );
  console.log("Created .env.cloudflare (gitignored) with account id.");
}

function wranglerSecretPut(name, value) {
  if (!value) {
    console.warn(`Skip secret ${name}: missing in .env.local`);
    return false;
  }
  const result = spawnSync(
    "npx",
    ["wrangler", "secret", "put", name, "--name", workerName],
    {
      input: value,
      encoding: "utf8",
      shell: true,
      stdio: ["pipe", "inherit", "inherit"],
    },
  );
  if (result.status !== 0) {
    throw new Error(`Failed to set secret ${name}`);
  }
  console.log(`Secret set via wrangler: ${name}`);
  return true;
}

async function cf(path, init = {}) {
  if (!token) throw new Error("No CLOUDFLARE_API_TOKEN");
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

async function putSecretApi(name, value) {
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
  console.log(`Secret set via API: ${name}`);
}

function syncWranglerJsoncVars() {
  const path = resolve(process.cwd(), "wrangler.jsonc");
  if (!existsSync(path)) return;
  let text = readFileSync(path, "utf8");
  // Keep JSONC comments; replace "vars" object only.
  const varsBlock = `  "vars": ${JSON.stringify(plainVars, null, 4).replace(/\n/g, "\n  ")}`;
  if (/"vars"\s*:\s*\{[\s\S]*?\n  \}/.test(text)) {
    text = text.replace(/"vars"\s*:\s*\{[\s\S]*?\n  \}/, varsBlock.trim());
  } else {
    text = text.replace(/\n\}\s*$/, `,\n${varsBlock}\n}\n`);
  }
  writeFileSync(path, text.endsWith("\n") ? text : `${text}\n`);
  console.log("Updated wrangler.jsonc vars.");
}

async function main() {
  console.log(`Syncing Cloudflare worker: ${workerName}`);
  ensureCloudflareEnvFile();
  syncWranglerJsoncVars();

  console.log("Plain vars to ship on next deploy:");
  for (const [k, v] of Object.entries(plainVars)) {
    console.log(`  ${k}=${v}`);
  }

  if (token) {
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
      console.log("Plain text bindings patched via API.");
    } catch (error) {
      console.warn("API bindings patch skipped:", error.message);
    }
  } else {
    console.log(
      "No CLOUDFLARE_API_TOKEN — plain vars will apply on next `yarn deploy` via wrangler.jsonc.",
    );
  }

  let setCount = 0;
  for (const [name, value] of Object.entries(secrets)) {
    try {
      if (token && value) {
        await putSecretApi(name, value);
        setCount += 1;
      } else if (wranglerSecretPut(name, value)) {
        setCount += 1;
      }
    } catch (error) {
      console.warn(`Could not set ${name}:`, error.message);
    }
  }

  // Verify
  const listed = spawnSync(
    "npx",
    ["wrangler", "secret", "list", "--name", workerName],
    { encoding: "utf8", shell: true },
  );
  console.log("Current worker secrets:");
  console.log(listed.stdout || listed.stderr || "(none)");
  console.log(`Done. Secrets written this run: ${setCount}`);
  if (!secrets.APPWRITE_API_KEY) {
    console.error("CRITICAL: APPWRITE_API_KEY missing from .env.local");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
