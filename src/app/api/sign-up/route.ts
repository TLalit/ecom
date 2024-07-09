import { accountTable, db, userTable } from "@/db";
import { getFirst } from "@/lib/array.helpers";
import { saltAndHashPassword } from "@/lib/password";
import { respondError, respondJson } from "@/lib/server.helpers";
import {
  PostSignUpRequest,
  PostSignUpResponse,
} from "@/types/sign-up.api.types";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

const requestValidator = z.object({
  name: z.string().nullish(),
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export const POST = async (req: Request) => {
  try {
    const requestBody: PostSignUpRequest = await req.json();
    const { success, data, error } = requestValidator.safeParse(requestBody);
    if (!success) {
      return respondError({
        status: 400,
        message: "Invalid request body",
        err: error,
      });
    }
    const user = await getFirst(
      db
        .select()
        .from(userTable)
        .leftJoin(accountTable, eq(userTable.id, accountTable.userId))
        .where(
          and(eq(userTable.email, data.email), isNull(userTable.archivedAt)),
        ),
    );
    if (user) {
      return respondError({
        status: 400,
        message: `User already exists. Please login with ${user.account?.provider ?? "Email and Password"}`,
      });
    }
    const [createdUser] = await db
      .insert(userTable)
      .values({
        email: data.email,
        name: data.name,
        password: saltAndHashPassword(data.password),
      })
      .returning({
        email: userTable.email,
        name: userTable.name,
      });

    return respondJson<PostSignUpResponse>({
      data: createdUser,
      status: 200,
    });
  } catch (error) {
    console.trace(error);
    return respondError({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
