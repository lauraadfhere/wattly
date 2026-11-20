import { Client, TablesDB, Users, Account } from "node-appwrite";
import { appwriteConfig } from "./config";

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    client,
    tablesDB: new TablesDB(client),
    users: new Users(client),
    account: new Account(client),
  };
}
