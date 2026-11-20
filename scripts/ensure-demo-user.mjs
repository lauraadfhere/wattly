import { Client, Users, ID, Query, TablesDB, Permission, Role } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly";

const DEMOS = [
  {
    email: "learner@wattly.app",
    password: "demowattly",
    name: "Demo Learner",
    role: "learner",
  },
  {
    email: "parent@wattly.app",
    password: "demowattly",
    name: "Demo Parent",
    role: "parent",
  },
  {
    email: "teacher@wattly.app",
    password: "demowattly",
    name: "Demo Teacher",
    role: "teacher",
  },
];

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const users = new Users(client);
const tablesDB = new TablesDB(client);

async function ensureUser(demo) {
  let userId;

  const listed = await users.list({
    queries: [Query.equal("email", demo.email)],
  });

  if (listed.users?.[0]) {
    userId = listed.users[0].$id;
    console.log(`Exists: ${demo.email} (${userId})`);
    try {
      await users.updatePassword({ userId, password: demo.password });
    } catch {
      // ignore
    }
  } else {
    const created = await users.create({
      userId: ID.unique(),
      email: demo.email,
      password: demo.password,
      name: demo.name,
    });
    userId = created.$id;
    console.log(`Created: ${demo.email} (${userId})`);
  }

  const ownerPermissions = [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
    Permission.read(Role.any()),
  ];

  const existing = await tablesDB.listRows({
    databaseId,
    tableId: "wattly",
    queries: [Query.equal("email", demo.email), Query.limit(1)],
  });

  if (!existing.rows?.length) {
    await tablesDB.createRow({
      databaseId,
      tableId: "wattly",
      rowId: ID.unique(),
      data: {
        user_id: userId,
        role: demo.role,
        display_name: demo.name,
        email: demo.email,
        locale: "en",
        onboarding_done: true,
      },
      permissions: ownerPermissions,
    });
    console.log(`Profile row created for ${demo.role}`);
  } else {
    console.log(`Profile row OK for ${demo.role}`);
  }
}

async function main() {
  for (const demo of DEMOS) {
    await ensureUser(demo);
  }
  console.log("Demo accounts ready (password: demowattly)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
