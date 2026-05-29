import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { userRouter } from "./user-router";
import { studyRouter } from "./study-router";
import { activityRouter } from "./activity-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  user: userRouter,
  study: studyRouter,
  activity: activityRouter,
});

export type AppRouter = typeof appRouter;
