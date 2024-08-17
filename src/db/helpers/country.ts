"use server";
import { CountryTable, db } from "@/db";
import { UpdateCountriesSchema } from "@/validators/country.vallidators";
import { and, eq, ExtractTablesWithRelations, inArray } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { Session } from "next-auth";
import { z } from "zod";

export const createUpdateCountriesAction = async (
  payload: z.infer<typeof UpdateCountriesSchema>,
  data: {
    mode: "create" | "edit" | "delete";
    trx?: PgTransaction<NodePgQueryResultHKT, any, ExtractTablesWithRelations<any>>;
    session: Session;
  },
) => {
  const { mode, trx, session } = data;
  const dbInstance = trx ? trx : db;
  const { countryIds, regionId } = payload;

  if (mode === "edit") {
    return Promise.all([
      await dbInstance
        .update(CountryTable)
        .set({
          regionId: null,
          updatedBy: session.user.id,
        })
        .where(eq(CountryTable.regionId, regionId)),

      await dbInstance
        .update(CountryTable)
        .set({ regionId, updatedBy: session.user.id })
        .where(inArray(CountryTable.id, countryIds))
        .returning({ id: CountryTable.id }),
    ]);
  }
  if (mode === "create") {
    return await db
      .update(CountryTable)
      .set({ regionId, updatedBy: session.user.id })
      .where(and(inArray(CountryTable.id, countryIds)))
      .returning({ id: CountryTable.id });
  }
  if (mode === "delete") {
    return await dbInstance
      .update(CountryTable)
      .set({
        regionId: null,
        updatedBy: session.user.id,
      })
      .where(eq(CountryTable.regionId, regionId))
      .returning({ id: CountryTable.id });
  }
};
