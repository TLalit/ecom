import { getPaginationValues } from "./action.helpers";
import { auth } from "@/auth";
import { PaginationParams } from "./action.types";
import { currency, db } from "@/db";
import { and, count, eq, inArray, isNull } from "drizzle-orm";
import { AvailableCurrencyActionsSchema, DefaultCurrencySchema } from "@/validators/currency.validators";
import { z } from "zod";

export interface GetCurrencyAction extends PaginationParams { }

export type GetCurrencyActionResponse = Awaited<ReturnType<typeof getCurrencyAction>>



export const getCurrencyAction = async ({ ...paginationParams }: GetCurrencyAction) => {
    const { page, limit, offset } = getPaginationValues(paginationParams);
    const session = await auth();
    if (!session?.user?.roles.includes("admin")) {
        throw new Error("Unauthorized");
    }

    const getCurrency = db.select({
        id: currency.id,
        name: currency.name,
        symbol: currency.symbol,
        code: currency.code,
        value: currency.value,
        isDefault: currency.isDefault,
        isAvailable: currency.isAvailable,
    })
        .from(currency)
        .limit(limit)
        .offset(offset)

    const getTotalCount = db.select({
        total: count()
    }).from(currency)
        .then((res) => res[0].total);

    const [currencies, totalCount] = await Promise.all([
        getCurrency,
        getTotalCount,
    ]);

    return {
        currencies,
        page,
        limit,
        total: totalCount,
    };
}

export const createAvailableCurrencyAction = async (payload: z.infer<typeof AvailableCurrencyActionsSchema>) => {
    const session = await auth();

    if (!session?.user?.roles.includes("admin")) {
        throw new Error("Unauthorized");
    }

    const { success, data, error } = AvailableCurrencyActionsSchema.safeParse(payload);
    if (!success) {
        throw new Error("Invalid Request", {
            cause: error.errors,
        });
    }

    const { id } = await db.update(currency).set({
        isAvailable: true,
        updatedAt: new Date()
    })
        .where(inArray(currency.id, data.currencyIds))
        .returning()
        .then(res => res[0])

    return id;
}

export const deleteAvailableCurrencyAction = async (payload: z.infer<typeof AvailableCurrencyActionsSchema>) => {
    const session = await auth();

    if (!session?.user?.roles.includes("admin")) {
        throw new Error("Unauthorized");
    }

    const { success, data, error } = AvailableCurrencyActionsSchema.safeParse(payload);

    if (!success) {
        throw new Error("Invalid Request", {
            cause: error.errors,
        });
    }

    const { id } = await db.update(currency).set({
        isAvailable: false,
        updatedAt: new Date()
    }).where(inArray(currency.id, data.currencyIds)).returning().then((res) => res[0]);

    return id
}

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

    await db.transaction(async (tx) => {
        await tx.update(currency).set({
            isDefault: false,
            updatedAt: new Date()
        }).where(eq(currency.isDefault, true))

        await tx.update(currency).set({
            isDefault: true,
            updatedAt: new Date()
        }).where(eq(currency.id, data.currencyId))
    }).then(res => console.log(res))

}





