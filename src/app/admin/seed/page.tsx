"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { errorHandler } from "@/lib/query.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { seedCountries, seedCurrencies } from "./actions";

export default function Page() {
  const countryMutation = useMutation({
    mutationKey: ["seed-countries"],
    mutationFn: seedCountries,
    onSuccess: ({ countriesCreated }) => {
      toast.success(`${countriesCreated} Countries Created`);
    },
    onError: errorHandler(),
  });
  const currencyMutation = useMutation({
    mutationKey: ["seed-currencies"],
    mutationFn: seedCurrencies,
    onSuccess: ({ currenciesCreated }) => {
      toast.success(`${currenciesCreated} Currencies Created`);
    },
    onError: errorHandler(),
  });
  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <h1 className="items-center text-2xl font-bold">Seed Data for missing data</h1>
      <div className="flex flex-col gap-4 bg-white p-4">
        <LoadingButton loading={countryMutation.isPending} onClick={() => countryMutation.mutate()}>
          Seed Countries
        </LoadingButton>
        <LoadingButton loading={currencyMutation.isPending} onClick={() => currencyMutation.mutate()}>
          Seed Currencies
        </LoadingButton>
        <Button>Seed Users</Button>
      </div>
    </main>
  );
}
