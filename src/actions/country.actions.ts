"use server"
import { auth } from "@/auth";
import { CountryTable, db } from "@/db";


export const fetchCountriesAction = async () => {
    const session = await auth();
    console.log("contry ran")
    if (!session?.user?.roles.includes("admin")) {
        throw new Error("Unauthorized");
    }

    return await db.select()
        .from(CountryTable);

}