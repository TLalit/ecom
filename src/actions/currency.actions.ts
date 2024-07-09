"use server";
import { auth } from "@/auth";
import { currencyTable, db } from "@/db";
import {
  AvailableCurrencySchema,
  // AvailableCurrencyActionsSchema,
  DefaultCurrencySchema,
  EditCurrencySchema,
} from "@/validators/currency.validators";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type GetCurrencyActionResponse = Awaited<
  ReturnType<typeof getCurrencyAction>
>;

export const getCurrencyAction = async () => {
  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const currencies = await db
    .select({
      id: currencyTable.id,
      name: currencyTable.name,
      symbol: currencyTable.symbol,
      code: currencyTable.code,
      value: currencyTable.value,
      isDefault: currencyTable.isDefault,
      isAvailable: currencyTable.isAvailable,
    })
    .from(currencyTable);

  return {
    currencies,
    total: currencies.length,
  };
};

export const createAvailableCurrencyAction = async (
  payload: z.infer<typeof AvailableCurrencySchema>,
) => {
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
      .update(currencyTable)
      .set({
        isAvailable: true,
        value: curr.value,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(currencyTable.id, curr.currencyId))
      .returning()
      .then((res) => res[0].id);

    return updateCurrency;
  });

  return await Promise.all(availableCurrencyMap);
};

export const deleteAvailableCurrencyAction = async (
  payload: z.infer<typeof DefaultCurrencySchema>,
) => {
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
    .update(currencyTable)
    .set({
      isAvailable: false,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    })
    .where(eq(currencyTable.id, data.currencyId))
    .returning({ id: currencyTable.id });
};

export const updateDefaultCurrencyAction = async (
  payload: z.infer<typeof DefaultCurrencySchema>,
) => {
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

  await db
    .transaction(async (tx) => {
      await tx
        .update(currencyTable)
        .set({
          isDefault: false,
          updatedAt: new Date(),
          updatedBy: session.user.id,
        })
        .where(eq(currencyTable.isDefault, true));

      await tx
        .update(currencyTable)
        .set({
          isDefault: true,
          updatedAt: new Date(),
          updatedBy: session.user.id,
        })
        .where(eq(currencyTable.id, data.currencyId));
    })
    .then((res) => console.log(res));
};

export const editAvailableCurrencyActions = async (
  payload: z.infer<typeof EditCurrencySchema>,
) => {
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
    .update(currencyTable)
    .set({
      value: data.value,
      updatedAt: new Date(),
      updatedBy: session.user.name,
    })
    .where(eq(currencyTable.id, data.currencyId))
    .returning()
    .then((res) => res[0]);

  return id;
};
