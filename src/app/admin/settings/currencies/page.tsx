'use client'
import { getCurrencyAction } from "@/actions/currency.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Page() {

    const { data, isFetching } = useQuery({
        queryKey: ["getCurrencies"],
        queryFn: async () => getCurrencyAction(),
    });

    console.log({ data });

    return <>
        <Card className="mx-auto max-w-4xl shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Currencies</CardTitle>
                <CardDescription>
                    Manage the markets that you will operate within.
                </CardDescription>
            </CardHeader>
        </Card>
        <Card className="mx-auto max-w-4xl shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Store currencies</CardTitle>
                <CardDescription className="flex justify-between">
                    All the currencies available in your store.
                    <Button>Edit Currencies</Button>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>Currency</div>

            </CardContent>
        </Card>
    </>
}