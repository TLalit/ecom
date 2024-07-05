import { z } from "zod";

export const AvailableCurrencyActionsSchema = z.object({
  currencyIds: z.array(z.string()),
});

export const DefaultCurrencySchema = z.object({
  currencyId: z.string(),
});
