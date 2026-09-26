import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@env";
export const db = drizzle({
  connection: {
    connectionString: env.DB_URL,
    onConnect: () => {
      console.log(`sucessfully connected to db ${env.DB_NAME}`);
    },
  },
});
