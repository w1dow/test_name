import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { eq, or } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";
import { TRPCError } from "@trpc/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lumis-local-auth-secret-key-2024"
);

async function createToken(userId: number): Promise<string> {
  return new SignJWT({ sub: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyLocalToken(
  token: string
): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    });
    if (payload.sub) {
      return { userId: parseInt(payload.sub, 10) };
    }
    return null;
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check uniqueness
      const existing = await db
        .select()
        .from(schema.users)
        .where(
          or(
            eq(schema.users.username, input.username),
            input.email ? eq(schema.users.email, input.email) : undefined
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username or email already exists",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const unionId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const result = await db.insert(schema.users).values({
        unionId,
        name: input.name,
        username: input.username,
        email: input.email || null,
        phone: input.phone || null,
        passwordHash,
        lastSignInAt: new Date(),
      });

      const userId = Number(result[0].insertId);
      const token = await createToken(userId);

      return { token, userId };
    }),

  login: publicQuery
    .input(
      z.object({
        identifier: z.string().min(1, "Username, email, or phone is required"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const users = await db
        .select()
        .from(schema.users)
        .where(
          or(
            eq(schema.users.username, input.identifier),
            eq(schema.users.email, input.identifier),
            eq(schema.users.phone, input.identifier)
          )
        )
        .limit(1);

      const user = users[0];
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      await db
        .update(schema.users)
        .set({ lastSignInAt: new Date() })
        .where(eq(schema.users.id, user.id));

      const token = await createToken(user.id);
      return { token, userId: user.id };
    }),

  verify: publicQuery.query(async ({ ctx }) => {
    const authHeader =
      ctx.req.headers.get("x-auth-token") ||
      ctx.req.headers.get("authorization")?.replace("Bearer ", "");

    if (!authHeader) {
      return { valid: false, user: null };
    }

    const payload = await verifyLocalToken(authHeader);
    if (!payload) {
      return { valid: false, user: null };
    }

    const db = getDb();
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, payload.userId))
      .limit(1);

    const user = users[0] || null;
    return { valid: !!user, user };
  }),
});
