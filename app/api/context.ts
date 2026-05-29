import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth-router";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth failed, try local auth
  }

  // If no OAuth user, try local auth token
  if (!ctx.user) {
    try {
      const authHeader =
        opts.req.headers.get("x-auth-token") ||
        opts.req.headers.get("authorization")?.replace("Bearer ", "");

      if (authHeader) {
        const payload = await verifyLocalToken(authHeader);
        if (payload) {
          const db = getDb();
          const users = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, payload.userId))
            .limit(1);
          if (users[0]) {
            ctx.user = users[0];
          }
        }
      }
    } catch {
      // Local auth failed too
    }
  }

  return ctx;
}
