import { Client, Users, ID, Query, TablesDB, Permission, Role } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly";

const DEMO = {
  email: "demo@wattly.app",
  password: "demowattly",
  name: "Wattly Demo",
};

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const users = new Users(client);
const tablesDB = new TablesDB(client);

async function main() {
  let userId;

  try {
    const listed = await users.list({ queries: [Query.equal("email", DEMO.email)] });
    if (listed.users?.[0]) {
      userId = listed.users[0].$id;
      console.log(`Demo user exists: ${userId}`);
      try {
        await users.updatePassword({ userId, password: DEMO.password });
      } catch {
        // password update optional
      }
    }
  } catch (error) {
    console.log("List users failed, will create:", error.message);
  }

  if (!userId) {
    const created = await users.create({
      userId: ID.unique(),
      email: DEMO.email,
      password: DEMO.password,
      name: DEMO.name,
    });
    userId = created.$id;
    console.log(`Created demo user: ${userId}`);
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
    queries: [Query.equal("email", DEMO.email), Query.limit(1)],
  });

  if (!existing.rows?.length) {
    await tablesDB.createRow({
      databaseId,
      tableId: "wattly",
      rowId: ID.unique(),
      data: {
        user_id: userId,
        role: "learner",
        display_name: DEMO.name,
        email: DEMO.email,
        locale: "en",
        onboarding_done: true,
      },
      permissions: ownerPermissions,
    });
    console.log("Created demo wattly profile row");
  } else {
    console.log("Demo profile row already present");
  }

  console.log("Demo ready:", DEMO.email, "/", DEMO.password);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
