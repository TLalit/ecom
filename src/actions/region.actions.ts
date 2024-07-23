"use server";
import { auth } from "@/auth";
import { CountryTable, currencyTable, db, RegionTable } from "@/db";
import { createUpdateCountriesAction } from "@/db/helpers/country";
import { CreateRegionSchema, DeleteRegionSchema, EditRegionSchema } from "@/validators/region.validators";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export type fetchRegionsActionResponse = Awaited<ReturnType<typeof fetchRegionsAction>>;

export const fetchRegionsAction = async () => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const regions = await db
    .select({
      id: RegionTable.id,
      region: RegionTable.name,
      countries: sql<
        {
          id: string;
          name: string;
          display_name: string;
          regionId: string;
        }[]
      >`COALESCE(json_agg(${CountryTable}),'[]')`,
      currencies: sql<
        {
          id: string;
          name: string;
          code: string;
          symbol: string;
          value: number;
        }[]
      >`COALESCE(json_agg(${currencyTable}),'[]')`,
    })
    .from(RegionTable)
    .leftJoin(currencyTable, eq(RegionTable.currencyId, currencyTable.id))
    .leftJoin(CountryTable, eq(RegionTable.id, CountryTable.regionId))
    .groupBy(RegionTable.id);
  return {
    regions,
    total: regions.length,
  };
};

export const createRegionAction = async (payload: z.infer<typeof CreateRegionSchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = CreateRegionSchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const { currencyId, name, countryIds } = data;

  return await db.transaction(async (trx) => {
    const region = await trx
      .insert(RegionTable)
      .values({
        name,
        currencyId,
        updatedBy: session?.user.id,
      })
      .returning({ id: RegionTable.id });

    const regionId = region[0].id;

    await createUpdateCountriesAction(
      { regionId, countryIds },
      {
        mode: "create",
        trx,
        session,
      },
    );
  });
};

export const editRegionAction = async (payload: z.infer<typeof EditRegionSchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } = EditRegionSchema.safeParse(payload);
  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const { regionId, countryIds, ...dataToUpdate } = data;

  return await db.transaction(async (trx) => {
    await createUpdateCountriesAction({ regionId, countryIds }, { mode: "edit", trx, session });

    await trx
      .update(RegionTable)
      .set({
        ...dataToUpdate,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(RegionTable.id, regionId))
      .returning({ id: RegionTable.id });
  });
};

export const deleteRegionAction = async (payload: z.infer<typeof DeleteRegionSchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = DeleteRegionSchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const { regionId } = data;

  return await db.transaction(async (trx) => {
    await createUpdateCountriesAction({ regionId, countryIds: [] }, { mode: "delete", trx, session });

    await trx.delete(RegionTable).where(eq(RegionTable.id, regionId)).returning({ id: RegionTable.id });
  });
};
