import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertPlaylistSchema, 
  insertPlaylistTrackSchema, 
  insertRecentlyPlayedSchema,
  insertUserSchema 
} from "@shared/schema";
import jwt from 'jsonwebtoken'; 
import * as dotenv from 'dotenv'; 
import { protect } from './middleware/authMiddleware'; // Import protect middleware

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-for-now';
if (JWT_SECRET === 'your-super-secret-key-for-now') {
  console.warn('Warning: Using default JWT_SECRET. Set JWT_SECRET in .env.local for production.');
}

const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schemas for protected routes - userId will come from req.user, not body
const protectedInsertPlaylistSchema = insertPlaylistSchema.omit({ userId: true });
const protectedInsertRecentlyPlayedSchema = insertRecentlyPlayedSchema.omit({ userId: true });

// Schema for updating a playlist (name and/or imageUrl)
const updatePlaylistSchema = insertPlaylistSchema.pick({ name: true, imageUrl: true }).partial();

// Schemas for updating Artist, Album, Track (all fields optional)
const updateArtistSchema = insertArtistSchema.partial();
const updateAlbumSchema = insertAlbumSchema.partial();
const updateTrackSchema = insertTrackSchema.partial();


export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all with /api
  
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.pick({ username: true, password: true }).parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }
      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      const user = await storage.getUserByUsername(validatedData.username);

      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await storage.verifyPassword(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } 
      );
      
      const { password, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", protect, async (req, res) => {
    if (req.user) {
      const user = await storage.getUser(req.user.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      // This case should ideally not be reached if 'protect' middleware works correctly
      // and req.user is always populated by the middleware.
      res.status(401).json({ message: "Not authorized (user not found on request)" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ message: 'Logged out successfully' });
  });

  // Existing Music App Routes (now some will be protected)
  
  app.get("/api/albums", async (_req, res) => {
    try {
      const albums = await storage.getAlbums();
      const albumsWithArtist = await Promise.all(
        albums.map(async (album) => {
          const artist = await storage.getArtist(album.artistId);
          return {
            ...album,
            artist: artist ? { id: artist.id, name: artist.name, imageUrl: artist.imageUrl } : null
          };
        })
      );
      res.json(albumsWithArtist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch albums", error: (error as Error).message });
    }
  });

  app.get("/api/albums/:id", async (req, res) => {
    try {
      const albumId = parseInt(req.params.id);
      const album = await storage.getAlbum(albumId);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      const artist = await storage.getArtist(album.artistId);
      const tracks = await storage.getTracksByAlbum(albumId);
      res.json({
        ...album,
        artist: artist ? { id: artist.id, name: artist.name, imageUrl: artist.imageUrl } : null,
        tracks
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch album", error: (error as Error).message });
    }
  });

  app.get("/api/artists", async (_req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists", error: (error as Error).message });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      const albums = await storage.getAlbumsByArtist(artistId);
      res.json({ ...artist, albums });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artist", error: (error as Error).message });
    }
  });

  // Update an artist
  app.put("/api/artists/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const artistId = parseInt(req.params.id);
      const validatedData = updateArtistSchema.parse(req.body);

      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "No fields to update provided" });
      }
      
      // Check if artist exists before attempting update
      const existingArtist = await storage.getArtist(artistId);
      if (!existingArtist) {
          return res.status(404).json({ message: "Artist not found" });
      }

      const updatedArtist = await storage.updateArtist(artistId, validatedData);
      if (!updatedArtist) {
        return res.status(404).json({ message: "Artist not found or failed to update" });
      }
      res.json(updatedArtist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid artist data", errors: error.errors });
      }
      console.error("Update artist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete an artist
  app.delete("/api/artists/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const artistId = parseInt(req.params.id);

      // Check if artist exists before attempting delete
      const existingArtist = await storage.getArtist(artistId);
      if (!existingArtist) {
          return res.status(404).json({ message: "Artist not found" });
      }

      // Note: Consider implications of deleting an artist (e.g., what happens to their albums/tracks?)
      // For this task, we assume a simple delete. Cascading deletes or soft deletes might be needed in a real app.
      const success = await storage.deleteArtist(artistId);
      if (success) {
        res.status(204).send();
      } else {
        return res.status(404).json({ message: "Artist not found or failed to delete" });
      }
    } catch (error) {
      console.error("Delete artist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  // Update an album
  app.put("/api/albums/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const albumId = parseInt(req.params.id);
      const validatedData = updateAlbumSchema.parse(req.body);

      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "No fields to update provided" });
      }

      // Check if album exists
      const existingAlbum = await storage.getAlbum(albumId);
      if (!existingAlbum) {
          return res.status(404).json({ message: "Album not found" });
      }
      
      // Optional: If artistId is part of validatedData, verify new artistId exists
      if (validatedData.artistId) {
        const artistExists = await storage.getArtist(validatedData.artistId);
        if (!artistExists) {
          return res.status(400).json({ message: `Artist with id ${validatedData.artistId} not found.` });
        }
      }

      const updatedAlbum = await storage.updateAlbum(albumId, validatedData);
      if (!updatedAlbum) {
        return res.status(404).json({ message: "Album not found or failed to update" });
      }
      res.json(updatedAlbum);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid album data", errors: error.errors });
      }
      console.error("Update album error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete an album
  app.delete("/api/albums/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const albumId = parseInt(req.params.id);

      // Check if album exists
      const existingAlbum = await storage.getAlbum(albumId);
      if (!existingAlbum) {
          return res.status(404).json({ message: "Album not found" });
      }

      // Note: Consider implications of deleting an album (e.g., what happens to its tracks?)
      const success = await storage.deleteAlbum(albumId);
      if (success) {
        res.status(204).send();
      } else {
        return res.status(404).json({ message: "Album not found or failed to delete" });
      }
    } catch (error) {
      console.error("Delete album error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tracks", async (_req, res) => {
    try {
      const tracks = await storage.getTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks", error: (error as Error).message });
    }
  });
  
  app.get("/api/albums/:id/tracks", async (req, res) => {
    try {
      const albumId = parseInt(req.params.id);
      const album = await storage.getAlbum(albumId);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      const tracks = await storage.getTracksByAlbum(albumId);
      const tracksWithArtist = await Promise.all(
        tracks.map(async (track) => {
          const artist = await storage.getArtist(track.artistId);
          return {
            ...track,
            album: { id: album.id, title: album.title, imageUrl: album.imageUrl },
            artist: artist ? { id: artist.id, name: artist.name } : null
          };
        })
      );
      res.json(tracksWithArtist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch album tracks", error: (error as Error).message });
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const trackId = parseInt(req.params.id);
      const track = await storage.getTrack(trackId);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      const album = await storage.getAlbum(track.albumId);
      const artist = await storage.getArtist(track.artistId);
      res.json({
        ...track,
        album: album ? { id: album.id, title: album.title, imageUrl: album.imageUrl } : null,
        artist: artist ? { id: artist.id, name: artist.name } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch track", error: (error as Error).message });
    }
  });

  // Update a track
  app.put("/api/tracks/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const trackId = parseInt(req.params.id);
      const validatedData = updateTrackSchema.parse(req.body);

      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "No fields to update provided" });
      }

      // Check if track exists
      const existingTrack = await storage.getTrack(trackId);
      if (!existingTrack) {
          return res.status(404).json({ message: "Track not found" });
      }

      // Optional: If albumId or artistId are part of validatedData, verify they exist
      if (validatedData.albumId) {
        const albumExists = await storage.getAlbum(validatedData.albumId);
        if (!albumExists) {
          return res.status(400).json({ message: `Album with id ${validatedData.albumId} not found.` });
        }
      }
      if (validatedData.artistId) {
        const artistExists = await storage.getArtist(validatedData.artistId);
        if (!artistExists) {
          return res.status(400).json({ message: `Artist with id ${validatedData.artistId} not found.` });
        }
      }
      
      const updatedTrack = await storage.updateTrack(trackId, validatedData);
      if (!updatedTrack) {
        return res.status(404).json({ message: "Track not found or failed to update" });
      }
      res.json(updatedTrack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid track data", errors: error.errors });
      }
      console.error("Update track error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete a track
  app.delete("/api/tracks/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const trackId = parseInt(req.params.id);

      // Check if track exists
      const existingTrack = await storage.getTrack(trackId);
      if (!existingTrack) {
          return res.status(404).json({ message: "Track not found" });
      }

      // Note: Consider implications of deleting a track (e.g., remove from playlists, recently played?)
      const success = await storage.deleteTrack(trackId);
      if (success) {
        res.status(204).send();
      } else {
        return res.status(404).json({ message: "Track not found or failed to delete" });
      }
    } catch (error) {
      console.error("Delete track error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Playlist Routes (Protected)
  app.get("/api/playlists", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" }); // Should be caught by protect
      const playlists = await storage.getPlaylistsByUser(req.user.id);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists", error: (error as Error).message });
    }
  });

  app.get("/api/playlists/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getPlaylist(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      if (playlist.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this playlist" });
      }
      
      const tracks = await storage.getPlaylistTracks(playlistId);
      const tracksWithDetails = await Promise.all(
        tracks.map(async (track) => {
          const album = await storage.getAlbum(track.albumId);
          const artist = await storage.getArtist(track.artistId);
          return {
            ...track,
            album: album ? { id: album.id, title: album.title, imageUrl: album.imageUrl } : null,
            artist: artist ? { id: artist.id, name: artist.name } : null
          };
        })
      );
      res.json({ ...playlist, tracks: tracksWithDetails });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlist", error: (error as Error).message });
    }
  });

  app.post("/api/playlists", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const validatedData = protectedInsertPlaylistSchema.parse(req.body);
      const playlistDataWithUser = { ...validatedData, userId: req.user.id };
      const playlist = await storage.createPlaylist(playlistDataWithUser);
      
      res.status(201).json(playlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid playlist data", errors: error.errors });
      }
      console.error("Create playlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/playlists/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const playlistId = parseInt(req.params.id);
      const validatedData = updatePlaylistSchema.parse(req.body);

      // Prevent empty object from being passed if no fields to update
      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "No fields to update provided" });
      }

      const playlist = await storage.getPlaylist(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      if (playlist.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this playlist" });
      }

      const updatedPlaylist = await storage.updatePlaylist(playlistId, validatedData);
      if (!updatedPlaylist) {
        // This might happen if the playlist is deleted between get and update, though unlikely.
        return res.status(404).json({ message: "Playlist not found or failed to update" });
      }
      res.json(updatedPlaylist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid playlist data", errors: error.errors });
      }
      console.error("Update playlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/playlists/:id", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const playlistId = parseInt(req.params.id);

      const playlist = await storage.getPlaylist(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      if (playlist.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this playlist" });
      }

      const success = await storage.deletePlaylist(playlistId);
      if (success) {
        res.status(204).send(); // Successfully deleted, no content
      } else {
        // This case implies the playlist was not found by deletePlaylist,
        // which might be redundant due to the prior getPlaylist check.
        return res.status(404).json({ message: "Playlist not found or failed to delete" });
      }
    } catch (error) {
      console.error("Delete playlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/playlists/:id/tracks", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const playlistId = parseInt(req.params.id);
      
      const playlist = await storage.getPlaylist(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      if (playlist.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this playlist" });
      }
      
      const currentTracks = await storage.getPlaylistTracks(playlistId);
      const position = currentTracks.length; 
      
      // Validate trackId from body, playlistId comes from param
      const validatedTrackData = insertPlaylistTrackSchema.pick({ trackId: true }).parse(req.body);

      // New: Check if the track to be added actually exists
      const trackToAdd = await storage.getTrack(validatedTrackData.trackId);
      if (!trackToAdd) {
        return res.status(404).json({ message: "Track to add not found" });
      }
      
      const playlistTrackData = {
        playlistId: playlistId,
        trackId: validatedTrackData.trackId, // Use validated trackId
        position: position
      };
      
      const result = await storage.addTrackToPlaylist(playlistTrackData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid track data", errors: error.errors });
      }
      console.error("Add track to playlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/playlists/:playlistId/tracks/:trackId", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const playlistId = parseInt(req.params.playlistId);
      const trackId = parseInt(req.params.trackId);

      const playlist = await storage.getPlaylist(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      if (playlist.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You do not own this playlist" });
      }
      
      const result = await storage.removeTrackFromPlaylist(playlistId, trackId);
      if (!result) {
        return res.status(404).json({ message: "Track not found in playlist" });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove track", error: (error as Error).message });
    }
  });

  // Recently Played Routes (Protected)
  app.get("/api/recently-played", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const recentlyPlayed = await storage.getRecentlyPlayed(req.user.id);
      res.json(recentlyPlayed);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recently played", error: (error as Error).message });
    }
  });

  app.post("/api/recently-played", protect, async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const validatedData = protectedInsertRecentlyPlayedSchema.parse(req.body);
      const recentlyPlayedDataWithUser = { ...validatedData, userId: req.user.id };
      const result = await storage.addRecentlyPlayed(recentlyPlayedDataWithUser);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Add recently played error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
