import { auth } from "@/auth";
import { CountryTable, db, RegionTable } from "@/db";
import { CreateRegionSchema, DeleteRegionSchema, EditRegionSchema } from "@/validators/region.validators";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export type fetchRegionsActionResponse = Awaited<ReturnType<typeof fetchRegionsAction>>;

export const fetchRegionsAction = async () => {
    const regions = await db
        .select({
            id: RegionTable.id,
            name: RegionTable.name,
            countries: sql<{
                id: string,
                name: string,
                displayName: string
                regionId: string
            }[]>`COALESCE(json_agg(${CountryTable}),'[]')`
        })
        .from(RegionTable)
        .leftJoin(CountryTable, eq(RegionTable.id, CountryTable.regionId))
        .groupBy(RegionTable.id);

    return {
        regions,
        total: regions.length
    }
}

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

    const { regionId, currencyId, name, countryIds } = data;
    //todo: country table update with regionId for all countryIds
    return await db.insert(RegionTable)
        .values({
            id: regionId,
            name,
            currencyId,
            updatedBy: session?.user.id,
        })
        .returning({ id: RegionTable.id })


}

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
    //todo: country table update with regionId for all countryIds

    return await db
        .update(RegionTable)
        .set({ ...dataToUpdate, updatedBy: session.user.id, updatedAt: new Date() })
        .where(eq(RegionTable.id, regionId))
        .returning({ id: RegionTable.id });
}

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

    //todo: country table update with regionId for all countryIds

    return await db
        .delete(RegionTable)
        .where(eq(RegionTable.id, regionId))
        .returning({ id: RegionTable.id });
};