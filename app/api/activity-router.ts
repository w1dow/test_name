import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const activityRouter = createRouter({
  log: authedQuery
    .input(
      z.object({
        type: z.enum([
          "login",
          "study_start",
          "study_end",
          "theme_switch",
          "page_view",
        ]),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.insert(schema.userActivity).values({
        userId: ctx.user.id,
        activityType: input.type,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      });
      return { success: true };
    }),

  getRecent: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const activities = await db
      .select()
      .from(schema.userActivity)
      .where(eq(schema.userActivity.userId, ctx.user.id))
      .orderBy(desc(schema.userActivity.createdAt))
      .limit(50);
    return activities;
  }),
});
