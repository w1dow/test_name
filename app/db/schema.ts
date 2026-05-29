import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  json,
  date,
  bigint,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  username: varchar("username", { length: 100 }).unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  learnerType: mysqlEnum("learner_type", [
    "Visual",
    "Auditory",
    "Kinesthetic",
    "Reading/Writing",
  ]).default("Visual"),
  studyGoalHours: decimal("study_goal_hours", { precision: 4, scale: 1 }).default("4.0"),
  streakDays: int("streak_days").default(0),
  currentTheme: mysqlEnum("current_theme", ["sci-fi", "warm"]).default("sci-fi"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const studySessions = mysqlTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  date: date("date").notNull(),
  durationMinutes: int("duration_minutes").notNull(),
  topic: varchar("topic", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StudySession = typeof studySessions.$inferSelect;

export const userActivity = mysqlTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  activityType: mysqlEnum("activity_type", [
    "login",
    "study_start",
    "study_end",
    "theme_switch",
    "page_view",
  ]).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserActivity = typeof userActivity.$inferSelect;

export const focusSessions = mysqlTable("focus_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  topic: varchar("topic", { length: 255 }),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: int("duration_minutes"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FocusSession = typeof focusSessions.$inferSelect;
