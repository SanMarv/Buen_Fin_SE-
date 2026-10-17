import { db } from "@db/conection.js";
import type { LOCATION_ENTRY } from "@db/interfaces/jobs.interface.js";
import { locations } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { LOCATIONS } from "@lib/schemas/locations.schema.js";

export default async function () {
  try {
    console.log("Seeding locations...");
    const inserted = await db.select().from(locations);
    const genKey = (l: LOCATION_ENTRY) => JSON.stringify([l.state, l.city]);
    const lookup = new Map<string, number>(
      inserted.map((v) => [genKey(v), v.id]),
    );
    const newValues = new Set();
    // add new values
    for (const location of LOCATIONS) {
      const key = genKey(location);
      newValues.add(key);
      if (!lookup.has(key)) {
        await db.insert(locations).values(location);
        continue;
      }
      console.log(`ignoring [${location.state}, ${location.city}]`);
    }
    // delete not present in locations
    // ! This will remove the jobs of those locations
    const deleting = inserted.filter(
      (location) => !newValues.has(genKey(location)),
    );
    for (const { id } of deleting) {
      await db.delete(locations).where(eq(locations.id, id));
    }
    if (deleting.length > 0) {
      console.log("Deleted:");
      console.table(deleting);
    }
    console.log("New Locations Summary:");
    console.table(
      [...newValues].map((v) => {
        const [state, city] = JSON.parse(v as string) as string[];
        return { state, city };
      }),
    );
  } catch (e) {
    console.error(e);
  }
}
