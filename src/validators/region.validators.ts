import { z } from "zod";

const RegionSchema = z.object({
    regionId: z.string(),
    currencyId: z.string(),
    name: z.string()
})

const RegionIdSchema = RegionSchema.transform((data) => data.regionId)

export const CreateRegionSchema = RegionSchema.merge(
    z.object({
        countryIds: z.string().array(),

    })
)

export const EditRegionSchema = CreateRegionSchema

export const DeleteRegionSchema = z.object({
    regionId: RegionIdSchema
})