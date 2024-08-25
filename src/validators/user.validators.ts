import { UserRoles } from "@/types/db.types";
import { z } from "zod";
export const createTeamMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  roles: z.array(z.nativeEnum(UserRoles)).min(1),
  password: z.string().min(8),
});

export const updateTeamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  roles: z.array(z.nativeEnum(UserRoles)).min(1),
});
