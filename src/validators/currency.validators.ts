import { z } from "zod";

export const AvailableCurrencyActionsSchema = z.object({
  currencyIds: z.array(z.string()),
});

export const DefaultCurrencySchema = z.object({
  currencyId: z.string(),
});

export const DeleteCurrecncySchema = z.object({
  currencyIds: z.array(z.string()),
})

export const AvailabelCurrencySchema = z.object({
  availableCurrencies: z.array(z.object({ id: z.string(), value: z.number() }))
})


