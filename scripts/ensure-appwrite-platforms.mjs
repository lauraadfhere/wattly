/**
 * Registers Wattly web origins in Appwrite so browser clients are not blocked
 * with "Invalid Origin" / Failed to fetch.
 *
 * Usage: node --env-file=.env.local scripts/ensure-appwrite-platforms.mjs
 */
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;

if (!endpoint || !project || !key) {
  console.error("Missing Appwrite env vars.");
  process.exit(1);
}

const platforms = [
  {
    platformId: "wattly-local",
    name: "Wattly Local",
    hostname: "localhost",
  },
  {
    platformId: "wattly-local-ip",
    name: "Wattly Local IP",
    hostname: "127.0.0.1",
  },
  {
    platformId: "wattly-cf-workers",
    name: "Wattly Cloudflare",
    hostname: "wattly.cquesenberry5.workers.dev",
  },
];

async function listPlatforms() {
  const res = await fetch(`${endpoint}/projects/${project}/platforms`, {
    headers: {
      "X-Appwrite-Project": project,
      "X-Appwrite-Key": key,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.platforms || [];
}

async function ensurePlatform(platform) {
  const existing = await listPlatforms();
  const hit = existing.find(
    (p) => p.$id === platform.platformId || p.hostname === platform.hostname,
  );
  if (hit) {
    console.log(`OK platform: ${hit.hostname} (${hit.$id})`);
    return;
  }

  const res = await fetch(`${endpoint}/projects/${project}/platforms`, {
    method: "POST",
    headers: {
      "X-Appwrite-Project": project,
      "X-Appwrite-Key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platformId: platform.platformId,
      type: "web",
      name: platform.name,
      hostname: platform.hostname,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  console.log(`Created platform: ${json.hostname} (${json.$id})`);
}

async function main() {
  for (const platform of platforms) {
    await ensurePlatform(platform);
  }
  console.log("Appwrite web platforms ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
