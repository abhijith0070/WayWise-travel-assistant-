import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  travelDate: timestamp("travel_date").notNull(),
  returnDate: timestamp("return_date"),
  tripData: json("trip_data"), // Store AI-generated trip data
  createdAt: timestamp("created_at").defaultNow(),
});

export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id),
  day: integer("day").notNull(),
  activities: json("activities").notNull(), // Array of activity objects
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id),
  type: text("type").notNull(), // hotel, transport, activity
  providerId: text("provider_id").notNull(),
  bookingData: json("booking_data").notNull(),
  status: text("status").default("pending"),
  amount: integer("amount"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTripSchema = createInsertSchema(trips).pick({
  fromLocation: true,
  toLocation: true,
  travelDate: true,
  returnDate: true,
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  tripId: true,
  day: true,
  activities: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  tripId: true,
  type: true,
  providerId: true,
  bookingData: true,
  amount: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
