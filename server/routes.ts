import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertPlaylistSchema, insertPlaylistTrackSchema, insertRecentlyPlayedSchema } from "@shared/schema";

/**
 * Registers all API routes for the Express application.
 * Handles fetching and manipulating data related to albums, artists, tracks, playlists, and recently played items.
 * Note: Uses a hardcoded userId (1) for playlist and recently played routes for demonstration purposes.
 * @param app The Express application instance.
 * @returns The HTTP server instance.
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all with /api
  
  // Get all albums
  app.get("/api/albums", async (_req, res) => {
    try {
      const albums = await storage.getAlbums();
      
      // Fetch artist details for each album
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

  // Get album by ID
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

  // Get all artists
  app.get("/api/artists", async (_req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists", error: (error as Error).message });
    }
  });

  // Get artist by ID with their albums
  app.get("/api/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artist = await storage.getArtist(artistId);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      const albums = await storage.getAlbumsByArtist(artistId);
      
      res.json({
        ...artist,
        albums
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artist", error: (error as Error).message });
    }
  });

  // Get all tracks
  app.get("/api/tracks", async (_req, res) => {
    try {
      const tracks = await storage.getTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks", error: (error as Error).message });
    }
  });
  
  // Get tracks by album ID
  app.get("/api/albums/:id/tracks", async (req, res) => {
    try {
      const albumId = parseInt(req.params.id);
      const album = await storage.getAlbum(albumId);
      
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      
      const tracks = await storage.getTracksByAlbum(albumId);
      
      // Get artist info for each track
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

  // Get track by ID
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

  // Get user playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      // For demo, we'll use a fixed user ID of 1
      const userId = 1;
      
      const playlists = await storage.getPlaylistsByUser(userId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists", error: (error as Error).message });
    }
  });

  // Get playlist by ID with tracks
  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getPlaylist(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      
      const tracks = await storage.getPlaylistTracks(playlistId);
      
      // Fetch album and artist info for each track
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
      
      res.json({
        ...playlist,
        tracks: tracksWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlist", error: (error as Error).message });
    }
  });

  // Create a new playlist
  app.post("/api/playlists", async (req, res) => {
    try {
      // For demo, we'll use a fixed user ID of 1
      req.body.userId = 1;
      
      const playlistData = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(playlistData);
      
      res.status(201).json(playlist);
    } catch (error) {
      res.status(400).json({ message: "Invalid playlist data", error: (error as Error).message });
    }
  });

  // Add track to playlist
  app.post("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      
      // Verify playlist exists
      const playlist = await storage.getPlaylist(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      
      // Get current tracks to determine position
      const currentTracks = await storage.getPlaylistTracks(playlistId);
      const position = currentTracks.length;
      
      const playlistTrackData = insertPlaylistTrackSchema.parse({
        ...req.body,
        playlistId,
        position
      });
      
      const result = await storage.addTrackToPlaylist(playlistTrackData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid track data", error: (error as Error).message });
    }
  });

  // Remove track from playlist
  app.delete("/api/playlists/:playlistId/tracks/:trackId", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.playlistId);
      const trackId = parseInt(req.params.trackId);
      
      const result = await storage.removeTrackFromPlaylist(playlistId, trackId);
      
      if (!result) {
        return res.status(404).json({ message: "Track not found in playlist" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove track", error: (error as Error).message });
    }
  });

  // Get recently played tracks
  app.get("/api/recently-played", async (_req, res) => {
    try {
      // For demo, we'll use a fixed user ID of 1
      const userId = 1;
      
      const recentlyPlayed = await storage.getRecentlyPlayed(userId);
      res.json(recentlyPlayed);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recently played", error: (error as Error).message });
    }
  });

  // Add to recently played
  app.post("/api/recently-played", async (req, res) => {
    try {
      // For demo, we'll use a fixed user ID of 1
      req.body.userId = 1;
      
      const recentlyPlayedData = insertRecentlyPlayedSchema.parse(req.body);
      const result = await storage.addRecentlyPlayed(recentlyPlayedData);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
