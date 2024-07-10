import { z } from "zod";

export const UpdateCountriesSchema = z.object({
    countryIds: z.array(z.string()),
    regionId: z.string(),
})

export const DeleteCountriesSchema = z.object({
    regionIds: z.array(z.string()),
})