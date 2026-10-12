import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@env";
import { relations } from "./schema.ts"; 
export const db = drizzle({
  relations, 
  connection: {
    connectionString: env.DB_URL,
    onConnect: () => {
      console.log(`sucessfully connected to db ${env.DB_NAME}`);
    },
  },
});
