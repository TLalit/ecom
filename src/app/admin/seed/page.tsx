"use client";

import { LoadingButton } from "@/components/ui/loading-button";
import { errorHandler } from "@/lib/query.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { seedCategories, seedCountries, seedCurrencies, seedOptions } from "./actions";

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
  const optionMutation = useMutation({
    mutationKey: ["seed-options"],
    mutationFn: seedOptions,
    onSuccess: ({ optionsCreated }) => {
      toast.success(`${optionsCreated} Options Created`);
    },
    onError: errorHandler(),
  });
  const categoryMutation = useMutation({
    mutationKey: ["seed-categories"],
    mutationFn: seedCategories,
    onSuccess: ({ categoriesCreated }) => {
      toast.success(`${categoriesCreated} Categories Created`);
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
        <LoadingButton loading={optionMutation.isPending} onClick={() => optionMutation.mutate()}>
          Seed Options
        </LoadingButton>
        <LoadingButton loading={categoryMutation.isPending} onClick={() => categoryMutation.mutate()}>
          Seed Categories
        </LoadingButton>
      </div>
    </main>
  );
}
