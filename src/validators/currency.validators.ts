import { z } from "zod";

export const DefaultCurrencySchema = z.object({
  currencyId: z.string(),
});

export const DeleteCurrencySchema = z.object({
  currencyIds: z.array(z.string()),
})

export const AvailableCurrencySchema = z.object({
  availableCurrencies: z.array(z.object({ currencyId: z.string(), value: z.number() }))
})

export const EditCurrencySchema = z.object({ currencyId: z.string(), value: z.number() })


