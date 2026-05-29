import { z } from "zod";
import { eq, and, gte } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const studyRouter = createRouter({
  startSession: authedQuery
    .input(
      z.object({
        topic: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(schema.focusSessions).values({
        userId: ctx.user.id,
        startTime: new Date(),
        topic: input.topic || null,
      });
      return { sessionId: Number(result[0].insertId) };
    }),

  endSession: authedQuery
    .input(
      z.object({
        sessionId: z.number(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const endTime = new Date();

      const sessions = await db
        .select()
        .from(schema.focusSessions)
        .where(
          and(
            eq(schema.focusSessions.id, input.sessionId),
            eq(schema.focusSessions.userId, ctx.user.id)
          )
        )
        .limit(1);

      const session = sessions[0];
      if (!session) {
        return { success: false };
      }

      const durationMinutes = Math.floor(
        (endTime.getTime() - new Date(session.startTime).getTime()) / 60000
      );

      await db
        .update(schema.focusSessions)
        .set({
          endTime,
          durationMinutes,
          completed: input.completed,
        })
        .where(eq(schema.focusSessions.id, input.sessionId));

      // Also record in study_sessions
      if (durationMinutes > 0) {
        await db.insert(schema.studySessions).values({
          userId: ctx.user.id,
          date: new Date(),
          durationMinutes,
          topic: session.topic || null,
        });
      }

      return { success: true, durationMinutes };
    }),

  getTodayProgress: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sessions = await db
      .select()
      .from(schema.studySessions)
      .where(
        and(
          eq(schema.studySessions.userId, ctx.user.id),
          gte(schema.studySessions.date, now)
        )
      );

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );

    return {
      totalMinutes,
      sessions: sessions.length,
      goalProgress: totalMinutes / 240, // 4 hours = 240 minutes
    };
  }),

  getWeeklyData: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions = await db
      .select()
      .from(schema.studySessions)
      .where(
        and(
          eq(schema.studySessions.userId, ctx.user.id),
          gte(schema.studySessions.date, sevenDaysAgo)
        )
      );

    const result: Array<{
      date: string;
      totalMinutes: number;
      sessions: number;
    }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const daySessions = sessions.filter((s) => {
        const sDate = new Date(s.date);
        const sStr = sDate.toISOString().split("T")[0];
        return sStr === dStr;
      });
      result.push({
        date: dStr,
        totalMinutes: daySessions.reduce(
          (sum, s) => sum + s.durationMinutes,
          0
        ),
        sessions: daySessions.length,
      });
    }

    return result;
  }),
});
