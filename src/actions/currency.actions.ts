"use server";
import { auth } from "@/auth";
import { CurrencyTable, db } from "@/db";
import { AvailableCurrencySchema, DefaultCurrencySchema, EditCurrencySchema } from "@/validators/currency.validators";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type GetCurrencyActionResponse = Awaited<ReturnType<typeof getCurrencyAction>>;

export const getCurrencyAction = async () => {
  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const currencies = await db
    .select({
      id: CurrencyTable.id,
      name: CurrencyTable.name,
      symbol: CurrencyTable.symbol,
      code: CurrencyTable.code,
      value: CurrencyTable.value,
      isDefault: CurrencyTable.isDefault,
      isAvailable: CurrencyTable.isAvailable,
    })
    .from(CurrencyTable);

  return {
    currencies,
    total: currencies.length,
  };
};

export const createAvailableCurrencyAction = async (payload: z.infer<typeof AvailableCurrencySchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }
  const { success, data, error } = AvailableCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const availableCurrencyMap = data.availableCurrencies.map((curr) => {
    const updateCurrency = db
      .update(CurrencyTable)
      .set({
        isAvailable: true,
        value: curr.value,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(CurrencyTable.id, curr.currencyId))
      .returning()
      .then((res) => res[0].id);

    return updateCurrency;
  });

  return await Promise.all(availableCurrencyMap);
};

export const deleteAvailableCurrencyAction = async (payload: z.infer<typeof DefaultCurrencySchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } = DefaultCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  return await db
    .update(CurrencyTable)
    .set({
      isAvailable: false,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    })
    .where(eq(CurrencyTable.id, data.currencyId))
    .returning({ id: CurrencyTable.id });
};

export const updateDefaultCurrencyAction = async (payload: z.infer<typeof DefaultCurrencySchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } = DefaultCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  return await db.transaction(async (tx) => {
    await tx
      .update(CurrencyTable)
      .set({
        isDefault: false,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(CurrencyTable.isDefault, true));

    await tx
      .update(CurrencyTable)
      .set({
        isDefault: true,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(CurrencyTable.id, data.currencyId))
      .returning({ id: CurrencyTable.id });
  });
};

export const editAvailableCurrencyActions = async (payload: z.infer<typeof EditCurrencySchema>) => {
  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } = EditCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const { id } = await db
    .update(CurrencyTable)
    .set({
      value: data.value,
      updatedAt: new Date(),
      updatedBy: session.user.name,
    })
    .where(eq(CurrencyTable.id, data.currencyId))
    .returning()
    .then((res) => res[0]);

  return id;
};
