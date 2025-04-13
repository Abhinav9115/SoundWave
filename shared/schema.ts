import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
});

export const insertArtistSchema = createInsertSchema(artists).pick({
  name: true,
  imageUrl: true,
  description: true,
});

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id").notNull(),
  imageUrl: text("image_url").notNull(),
  releaseYear: integer("release_year"),
  dominantColor: text("dominant_color"),
});

export const insertAlbumSchema = createInsertSchema(albums).pick({
  title: true,
  artistId: true,
  imageUrl: true,
  releaseYear: true,
  dominantColor: true,
});

export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Album = typeof albums.$inferSelect;

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  albumId: integer("album_id").notNull(),
  artistId: integer("artist_id").notNull(),
  duration: integer("duration").notNull(), // in seconds
  trackNumber: integer("track_number"),
});

export const insertTrackSchema = createInsertSchema(tracks).pick({
  title: true,
  albumId: true,
  artistId: true,
  duration: true,
  trackNumber: true,
});

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  name: true,
  userId: true,
  imageUrl: true,
});

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

export const playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull(),
  trackId: integer("track_id").notNull(),
  position: integer("position").notNull(),
});

export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).pick({
  playlistId: true,
  trackId: true,
  position: true,
});

export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;
export type PlaylistTrack = typeof playlistTracks.$inferSelect;

export const recentlyPlayed = pgTable("recently_played", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  trackId: integer("track_id").notNull(),
  playedAt: timestamp("played_at").defaultNow().notNull(),
});

export const insertRecentlyPlayedSchema = createInsertSchema(recentlyPlayed).pick({
  userId: true,
  trackId: true,
});

export type InsertRecentlyPlayed = z.infer<typeof insertRecentlyPlayedSchema>;
export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;
