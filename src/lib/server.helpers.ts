import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants";
import { GenericErrorResponse } from "@/types/generic.api.types";

export const respondJson = <T = any>({
  data,
  status,
  headers,
  statusText,
}: {
  status: ResponseInit["status"];
  data?: T;
  statusText?: ResponseInit["statusText"];
  headers?: ResponseInit["headers"];
}) => {
  return Response.json(data ?? null, {
    status,
    headers,
    statusText,
  });
};

export const respondError = ({
  message,
  err,
  status,
}: GenericErrorResponse & {
  status: ResponseInit["status"];
}) => Response.json({ message, error: err }, { status });

export const respondUnauthorizedError = respondError({
  message: "Unauthorized",
  status: 401,
});

export const getPaginationValues = (req: any) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get("page") ?? DEFAULT_LIMIT);
  const offset = page * limit;
  return { page, limit, offset };
};

export const getRoles = (req: any) => {
  if (!req.auth) return [];
  return req.auth?.user.roles;
};
