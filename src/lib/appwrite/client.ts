"use client";

import { Account, Client, TablesDB } from "appwrite";
import { appwriteConfig } from "./config";

export function createBrowserClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  return {
    client,
    account: new Account(client),
    tablesDB: new TablesDB(client),
  };
}
