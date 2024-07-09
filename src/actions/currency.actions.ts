"use server";
import { auth } from "@/auth";
import { currency, db } from "@/db";
import {
  AvailableCurrencySchema,
  // AvailableCurrencyActionsSchema,
  DefaultCurrencySchema,
  EditCurrencySchema,
} from "@/validators/currency.validators";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { PaginationParams } from "./action.types";


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
      id: currency.id,
      name: currency.name,
      symbol: currency.symbol,
      code: currency.code,
      value: currency.value,
      isDefault: currency.isDefault,
      isAvailable: currency.isAvailable,
    })
    .from(currency)


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
  const { success, data, error } =
    AvailableCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const availableCurrencyMap = data.availableCurrencies.map((curr) => {

    const updateCurrency = db.update(currency).set({
      isAvailable: true,
      value: curr.value,
      updatedAt: new Date(),
      updatedBy: session.user.id
    }).where(eq(currency.id, curr.currencyId)).returning()
      .then((res) => res[0].id);

    return updateCurrency
  })

  return await Promise.all(availableCurrencyMap)


};

export const deleteAvailableCurrencyAction = async (
  payload: z.infer<typeof DefaultCurrencySchema>,
) => {

  const session = await auth();

  if (!session?.user?.roles.includes("admin")) {
    throw new Error("Unauthorized");
  }

  const { success, data, error } =
    DefaultCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  return await db
    .update(currency)
    .set({
      isAvailable: false,
      updatedAt: new Date(),
      updatedBy: session.user.id
    })
    .where(eq(currency.id, data.currencyId))
    .returning({ id: currency.id })

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
        .update(currency)
        .set({
          isDefault: false,
          updatedAt: new Date(),
          updatedBy: session.user.id
        })
        .where(eq(currency.isDefault, true));

      await tx
        .update(currency)
        .set({
          isDefault: true,
          updatedAt: new Date(),
          updatedBy: session.user.id
        })
        .where(eq(currency.id, data.currencyId));
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

  const { success, data, error } =
    EditCurrencySchema.safeParse(payload);

  if (!success) {
    throw new Error("Invalid Request", {
      cause: error.errors,
    });
  }

  const { id } = await db
    .update(currency)
    .set({
      value: data.value,
      updatedAt: new Date(),
      updatedBy: session.user.name
    })
    .where(eq(currency.id, data.currencyId))
    .returning()
    .then((res) => res[0]);

  return id;
};