"use client";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const setSearchParams = useCallback(
    (
      params: URLSearchParams | Record<string, string>,
      options: { replace?: boolean } = { replace: true },
    ) => {
      if (searchParams === null) {
        return;
      }
      const currentParamsObj = Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {},
      );

      const paramsString = new URLSearchParams({
        ...currentParamsObj,
        ...params,
      });

      paramsString.forEach((value, key) => {
        if (!Boolean(value)) {
          paramsString.delete(key);
        }
      });

      const { replace } = options;
      if (replace) {
        window.history.replaceState(null, "", "?" + paramsString.toString());
      } else {
        window.history.pushState(null, "", "?" + paramsString.toString());
      }
    },
    [searchParams],
  );

  const deleteQueryParam = useCallback(
    (key: string) => {
      if (searchParams === null) {
        return;
      }
      const currentParamsObj: Record<string, string> = Array.from(
        searchParams.entries(),
      ).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      delete currentParamsObj[key];

      const paramsString = new URLSearchParams(currentParamsObj);
      window.history.replaceState(null, "", "?" + paramsString.toString());
    },
    [searchParams],
  );
  return { searchParams, setSearchParams, deleteQueryParam };
};
