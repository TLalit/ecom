import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants";
import { PaginationParams } from "./action.types";

export const getPaginationValues = ({ limit = DEFAULT_LIMIT, page = DEFAULT_PAGE }: PaginationParams = {}) => ({
  page,
  limit,
  offset: page * limit,
});
