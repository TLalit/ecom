"use server";

import { auth } from "@/auth";
import { CountryTable, CurrencyTable, db } from "@/db";
import Countries from "./country.json";
import Currencies from "./currency.json";

export async function seedCountries() {
  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const res = await db
    .insert(CountryTable)
    .values(
      Countries.map((item) => ({
        displayName: item.display_name,
        name: item.name,
        updatedBy: session.user.id,
      })),
    )
    .returning({ id: CountryTable.id });
  return { countriesCreated: res.length };
}
export async function seedCurrencies() {
  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const res = await db
    .insert(CurrencyTable)
    .values(
      Currencies.map((item) => ({
        symbol: item.symbol,
        name: item.name,
        updatedBy: session.user.id,
        code: item.code,
        isDefault: item.code === "usd",
        isAvailable: false,
      })),
    )
    .returning({ id: CurrencyTable.id });
  return { currenciesCreated: res.length };
}
