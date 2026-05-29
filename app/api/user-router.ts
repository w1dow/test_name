import { z } from "zod";
import { eq, and, gte } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const userRouter = createRouter({
  me: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, ctx.user.id))
      .limit(1);
    return users[0] || null;
  }),

  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        learnerType: z
          .enum(["Visual", "Auditory", "Kinesthetic", "Reading/Writing"])
          .optional(),
        studyGoalHours: z.number().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const updateData: Record<string, unknown> = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.username !== undefined) updateData.username = input.username;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.email !== undefined) updateData.email = input.email;
      if (input.learnerType !== undefined)
        updateData.learnerType = input.learnerType;
      if (input.studyGoalHours !== undefined)
        updateData.studyGoalHours = input.studyGoalHours;
      if (input.avatar !== undefined) updateData.avatar = input.avatar;

      await db
        .update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, ctx.user.id));

      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, ctx.user.id))
        .limit(1);

      return users[0];
    }),

  updateTheme: authedQuery
    .input(z.object({ theme: z.enum(["sci-fi", "warm"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(schema.users)
        .set({ currentTheme: input.theme })
        .where(eq(schema.users.id, ctx.user.id));
      return { success: true };
    }),

  getStudyStats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, ctx.user.id))
      .limit(1);

    const sessions = await db
      .select()
      .from(schema.studySessions)
      .where(
        and(
          eq(schema.studySessions.userId, ctx.user.id),
          gte(schema.studySessions.date, today)
        )
      );

    const todayMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    // Get last 7 days
    const weeklyData: Array<{ day: string; hours: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const daySessions = sessions.filter((s) => {
        const sDate = new Date(s.date);
        const sStr = sDate.toISOString().split("T")[0];
        return sStr === dStr;
      });
      const minutes = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      weeklyData.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        hours: Math.round((minutes / 60) * 10) / 10,
      });
    }

    return {
      todayMinutes,
      weeklyData,
      streakDays: user[0]?.streakDays || 0,
      goalHours: parseFloat(user[0]?.studyGoalHours?.toString() || "4"),
      learnerType: user[0]?.learnerType || "Visual",
    };
  }),
});
