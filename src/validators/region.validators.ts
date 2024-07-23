import { z } from "zod";

const RegionSchema = z.object({
  regionId: z.string(),
  currencyId: z.string(),
  name: z.string(),
});

const RegionIdSchema = RegionSchema.transform((data) => data.regionId);

export const CreateRegionSchema = RegionSchema.omit({
  regionId: true,
}).merge(
  z.object({
    countryIds: z.string().array(),
  }),
);

export const EditRegionSchema = RegionSchema.merge(
  z.object({
    countryIds: z.string().array(),
  }),
);

export const DeleteRegionSchema = z.object({
  regionId: z.string(),
});
