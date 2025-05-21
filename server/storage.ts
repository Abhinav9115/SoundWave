import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { 
  type User, type Track, type Album, type Artist, type Playlist, type PlaylistTrack, type RecentlyPlayed,
  type InsertUser, type InsertTrack, type InsertAlbum, type InsertArtist, type InsertPlaylist, 
  type InsertPlaylistTrack, type InsertRecentlyPlayed
} from "../shared/schema";
import { eq, desc, and, asc, sql } from 'drizzle-orm';
import { parse } from 'pg-connection-string';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs

// Load environment variables from .env.local at the very top
// Ensures DATABASE_URL is available when this module is loaded.
dotenv.config({ path: '.env.local' });

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(password: string, hash: string): Promise<boolean>; // Added new method
  
  // Artist operations
  getArtist(id: number): Promise<Artist | undefined>;
  getArtists(): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  
  // Album operations
  getAlbum(id: number): Promise<Album | undefined>;
  getAlbums(): Promise<Album[]>;
  getAlbumsByArtist(artistId: number): Promise<Album[]>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  
  // Track operations
  getTrack(id: number): Promise<Track | undefined>;
  getTracks(): Promise<Track[]>;
  getTracksByAlbum(albumId: number): Promise<Track[]>;
  getTracksByArtist(artistId: number): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  
  // Playlist operations
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylistsByUser(userId: number): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist | undefined>;
  deletePlaylist(id: number): Promise<boolean>;
  
  // Playlist tracks operations
  getPlaylistTracks(playlistId: number): Promise<Track[]>;
  addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack>;
  removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean>;
  reorderPlaylistTrack(playlistId: number, trackId: number, newPosition: number): Promise<boolean>;
  
  // Recently played operations
  getRecentlyPlayed(userId: number, limit?: number): Promise<{ track: Track; album: Album; artist: Artist }[]>;
  addRecentlyPlayed(recentlyPlayed: InsertRecentlyPlayed): Promise<RecentlyPlayed>;

  // Artist Update/Delete
  updateArtist(id: number, data: Partial<InsertArtist>): Promise<Artist | undefined>;
  deleteArtist(id: number): Promise<boolean>;

  // Album Update/Delete
  updateAlbum(id: number, data: Partial<InsertAlbum>): Promise<Album | undefined>;
  deleteAlbum(id: number): Promise<boolean>;

  // Track Update/Delete
  updateTrack(id: number, data: Partial<InsertTrack>): Promise<Track | undefined>;
  deleteTrack(id: number): Promise<boolean>;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // This check is now more reliable as dotenv.config() has been called.
  throw new Error("DATABASE_URL is not set. Ensure .env.local exists and is configured, or the variable is set in the environment.");
}
const pgConfig = parse(connectionString);

// Explicitly pass connection parameters to avoid interference from PG* env vars
const client = postgres({
  host: pgConfig.host || 'localhost',
  port: pgConfig.port ? parseInt(pgConfig.port, 10) : 5432,
  database: pgConfig.database || undefined, 
  user: pgConfig.user || undefined,
  password: pgConfig.password || undefined,
  ssl: pgConfig.ssl ? { rejectUnauthorized: false } : false, 
});

// Export db instance for use in other modules like seeding scripts
export const db = drizzle(client, { schema });

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      return await db.query.users.findFirst({ where: eq(schema.users.id, id) });
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      return await db.query.users.findFirst({ where: eq(schema.users.username, username) });
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
      throw error;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      const newUser = { ...user, password: hashedPassword };
      const result = await db.insert(schema.users).values(newUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (error) {
      console.error("Error in verifyPassword:", error);
      // It's generally better not to throw an error here for security reasons,
      // but to return false. However, following the pattern of other methods for now.
      throw error; 
    }
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    try {
      return await db.query.artists.findFirst({ where: eq(schema.artists.id, id) });
    } catch (error) {
      console.error("Error in getArtist:", error);
      throw error;
    }
  }

  async getArtists(): Promise<Artist[]> {
    try {
      return await db.query.artists.findMany();
    } catch (error) {
      console.error("Error in getArtists:", error);
      throw error;
    }
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    try {
      const result = await db.insert(schema.artists).values(artist).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createArtist:", error);
      throw error;
    }
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    try {
      return await db.query.albums.findFirst({ where: eq(schema.albums.id, id) });
    } catch (error) {
      console.error("Error in getAlbum:", error);
      throw error;
    }
  }

  async getAlbums(): Promise<Album[]> {
    try {
      return await db.query.albums.findMany();
    } catch (error) {
      console.error("Error in getAlbums:", error);
      throw error;
    }
  }

  async getAlbumsByArtist(artistId: number): Promise<Album[]> {
    try {
      return await db.query.albums.findMany({ where: eq(schema.albums.artistId, artistId) });
    } catch (error) {
      console.error("Error in getAlbumsByArtist:", error);
      throw error;
    }
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    try {
      const result = await db.insert(schema.albums).values(album).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createAlbum:", error);
      throw error;
    }
  }

  async getTrack(id: number): Promise<Track | undefined> {
    try {
      return await db.query.tracks.findFirst({ where: eq(schema.tracks.id, id) });
    } catch (error) {
      console.error("Error in getTrack:", error);
      throw error;
    }
  }

  async getTracks(): Promise<Track[]> {
    try {
      return await db.query.tracks.findMany();
    } catch (error) {
      console.error("Error in getTracks:", error);
      throw error;
    }
  }

  async getTracksByAlbum(albumId: number): Promise<Track[]> {
    try {
      return await db.query.tracks.findMany({ 
        where: eq(schema.tracks.albumId, albumId),
        orderBy: [asc(schema.tracks.trackNumber)] 
      });
    } catch (error) {
      console.error("Error in getTracksByAlbum:", error);
      throw error;
    }
  }

  async getTracksByArtist(artistId: number): Promise<Track[]> {
    try {
      return await db.query.tracks.findMany({ where: eq(schema.tracks.artistId, artistId) });
    } catch (error) {
      console.error("Error in getTracksByArtist:", error);
      throw error;
    }
  }

  async createTrack(track: InsertTrack): Promise<Track> {
    try {
      const result = await db.insert(schema.tracks).values(track).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createTrack:", error);
      throw error;
    }
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    try {
      return await db.query.playlists.findFirst({ where: eq(schema.playlists.id, id) });
    } catch (error) {
      console.error("Error in getPlaylist:", error);
      throw error;
    }
  }

  async getPlaylistsByUser(userId: number): Promise<Playlist[]> {
    try {
      return await db.query.playlists.findMany({ where: eq(schema.playlists.userId, userId) });
    } catch (error) {
      console.error("Error in getPlaylistsByUser:", error);
      throw error;
    }
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    try {
      const result = await db.insert(schema.playlists).values(playlist).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createPlaylist:", error);
      throw error;
    }
  }

  async updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist | undefined> {
    try {
      const result = await db.update(schema.playlists).set(playlist).where(eq(schema.playlists.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error in updatePlaylist:", error);
      throw error;
    }
  }

  async deletePlaylist(id: number): Promise<boolean> {
    try {
      const result = await db.delete(schema.playlists).where(eq(schema.playlists.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error in deletePlaylist:", error);
      throw error;
    }
  }

  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    try {
      const playlistTrackEntries = await db.query.playlistTracks.findMany({
        where: eq(schema.playlistTracks.playlistId, playlistId),
        orderBy: [asc(schema.playlistTracks.position)],
        with: {
          track: true
        }
      });
      return playlistTrackEntries.map(pt => pt.track).filter(t => t !== null && t !== undefined) as Track[];
    } catch (error) {
      console.error("Error in getPlaylistTracks:", error);
      throw error;
    }
  }

  async addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    try {
      // Ensure position is correctly handled, potentially by finding max position + 1 if not provided
      if (playlistTrack.position === undefined || playlistTrack.position === null) {
        const maxPositionResult = await db.select({ value: sql<number>`max(${schema.playlistTracks.position})`.mapWith(Number) })
          .from(schema.playlistTracks)
          .where(eq(schema.playlistTracks.playlistId, playlistTrack.playlistId));
        playlistTrack.position = (maxPositionResult[0]?.value || 0) + 1;
      }
      const result = await db.insert(schema.playlistTracks).values(playlistTrack).returning();
      return result[0];
    } catch (error) {
      console.error("Error in addTrackToPlaylist:", error);
      throw error;
    }
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    try {
      const result = await db.delete(schema.playlistTracks).where(and(
        eq(schema.playlistTracks.playlistId, playlistId),
        eq(schema.playlistTracks.trackId, trackId)
      )).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error in removeTrackFromPlaylist:", error);
      throw error;
    }
  }

  async reorderPlaylistTrack(playlistId: number, trackId: number, newPosition: number): Promise<boolean> {
    try {
      // This is a simplified reorder, more complex logic might be needed for production
      // to correctly adjust other track positions.
      const result = await db.update(schema.playlistTracks)
        .set({ position: newPosition })
        .where(and(
          eq(schema.playlistTracks.playlistId, playlistId),
          eq(schema.playlistTracks.trackId, trackId)
        ))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error in reorderPlaylistTrack:", error);
      throw error;
    }
  }
  
  async getRecentlyPlayed(userId: number, limit: number = 10): Promise<{ track: Track; album: Album; artist: Artist }[]> {
    try {
      const recentEntries = await db.query.recentlyPlayed.findMany({
        where: eq(schema.recentlyPlayed.userId, userId),
        orderBy: [desc(schema.recentlyPlayed.playedAt)],
        limit: limit,
        with: {
          track: {
            with: {
              album: true,
              artist: true,
            }
          }
        }
      });
      
      return recentEntries.map(rp => {
        if (!rp.track || !rp.track.album || !rp.track.artist) {
          console.warn("Missing related data for a recently played entry:", rp);
          return null; 
        }
        return {
          track: rp.track as Track,
          album: rp.track.album as Album,
          artist: rp.track.artist as Artist,
        };
      }).filter(item => item !== null) as { track: Track; album: Album; artist: Artist }[];
    } catch (error) {
      console.error("Error in getRecentlyPlayed:", error);
      throw error;
    }
  }

  async addRecentlyPlayed(recentlyPlayed: InsertRecentlyPlayed): Promise<RecentlyPlayed> {
    try {
      const result = await db.insert(schema.recentlyPlayed).values(recentlyPlayed).returning();
      return result[0];
    } catch (error) {
      console.error("Error in addRecentlyPlayed:", error);
      throw error;
    }
  }

  // Artist Update/Delete Implementations
  async updateArtist(id: number, data: Partial<InsertArtist>): Promise<Artist | undefined> {
    try {
      const result = await db.update(schema.artists).set(data).where(eq(schema.artists.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error in updateArtist:", error);
      throw error;
    }
  }

  async deleteArtist(id: number): Promise<boolean> {
    try {
      const result = await db.delete(schema.artists).where(eq(schema.artists.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error in deleteArtist:", error);
      throw error;
    }
  }

  // Album Update/Delete Implementations
  async updateAlbum(id: number, data: Partial<InsertAlbum>): Promise<Album | undefined> {
    try {
      // Potential: Add check if artistId in data exists if it's being updated
      const result = await db.update(schema.albums).set(data).where(eq(schema.albums.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error in updateAlbum:", error);
      throw error;
    }
  }

  async deleteAlbum(id: number): Promise<boolean> {
    try {
      // Potential: Consider cascading deletes or handling related tracks if album is deleted.
      // For now, simple delete.
      const result = await db.delete(schema.albums).where(eq(schema.albums.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error in deleteAlbum:", error);
      throw error;
    }
  }

  // Track Update/Delete Implementations
  async updateTrack(id: number, data: Partial<InsertTrack>): Promise<Track | undefined> {
    try {
      // Potential: Add checks if albumId or artistId in data exist if they are being updated
      const result = await db.update(schema.tracks).set(data).where(eq(schema.tracks.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error in updateTrack:", error);
      throw error;
    }
  }

  async deleteTrack(id: number): Promise<boolean> {
    try {
      // Potential: Remove from playlist_tracks as well?
      const result = await db.delete(schema.tracks).where(eq(schema.tracks.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error in deleteTrack:", error);
      throw error;
    }
  }
}

export const storage = new DbStorage();
