import { 
  users, tracks, albums, artists, playlists, playlistTracks, recentlyPlayed,
  type User, type Track, type Album, type Artist, type Playlist, type PlaylistTrack, type RecentlyPlayed,
  type InsertUser, type InsertTrack, type InsertAlbum, type InsertArtist, type InsertPlaylist, 
  type InsertPlaylistTrack, type InsertRecentlyPlayed
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artists: Map<number, Artist>;
  private albums: Map<number, Album>;
  private tracks: Map<number, Track>;
  private playlists: Map<number, Playlist>;
  private playlistTracks: Map<number, PlaylistTrack>;
  private recentlyPlayed: Map<number, RecentlyPlayed>;
  
  private userIdCounter: number;
  private artistIdCounter: number;
  private albumIdCounter: number;
  private trackIdCounter: number;
  private playlistIdCounter: number;
  private playlistTrackIdCounter: number;
  private recentlyPlayedIdCounter: number;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.albums = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.playlistTracks = new Map();
    this.recentlyPlayed = new Map();
    
    this.userIdCounter = 1;
    this.artistIdCounter = 1;
    this.albumIdCounter = 1;
    this.trackIdCounter = 1;
    this.playlistIdCounter = 1;
    this.playlistTrackIdCounter = 1;
    this.recentlyPlayedIdCounter = 1;

    // Initialize with sample data for testing
    this.initializeData();
  }

  private initializeData() {
    // Create some artists
    const cyberDreams = this.createArtist({ name: "Cyber Dreams", imageUrl: "https://images.unsplash.com/photo-1593697972672-b1c1074e69e9", description: "Electronic music producer known for futuristic sounds" });
    const lunaRay = this.createArtist({ name: "Luna Ray", imageUrl: "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8", description: "Indie pop artist with ethereal vocals" });
    const digitalPulse = this.createArtist({ name: "Digital Pulse", imageUrl: "https://images.unsplash.com/photo-1520785643438-5bf77931f493", description: "EDM collective with energetic beats" });
    const echoChamber = this.createArtist({ name: "Echo Chamber", imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a", description: "Ambient music composer focusing on atmospheric sounds" });
    const metroSound = this.createArtist({ name: "Metro Sound", imageUrl: "https://images.unsplash.com/photo-1514533212735-5df27d970db0", description: "Urban music producer with a knack for rhythmic beats" });

    // Create albums
    const neonHorizon = this.createAlbum({ title: "Neon Horizon", artistId: cyberDreams.id, imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17", releaseYear: 2023, dominantColor: "#9D4EDD" });
    const electricDreams = this.createAlbum({ title: "Electric Dreams", artistId: lunaRay.id, imageUrl: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8", releaseYear: 2022, dominantColor: "#3E78B2" });
    const synthWave = this.createAlbum({ title: "Synth Wave", artistId: digitalPulse.id, imageUrl: "https://images.unsplash.com/photo-1614613534528-3c6d0a9a8774", releaseYear: 2023, dominantColor: "#FF6B6B" });
    const midnightForest = this.createAlbum({ title: "Midnight Forest", artistId: echoChamber.id, imageUrl: "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0", releaseYear: 2021, dominantColor: "#00F5D4" });
    const urbanBeats = this.createAlbum({ title: "Urban Beats", artistId: metroSound.id, imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7", releaseYear: 2022, dominantColor: "#240046" });

    // Create tracks for Neon Horizon
    this.createTrack({ title: "Solar Flare", albumId: neonHorizon.id, artistId: cyberDreams.id, duration: 222, trackNumber: 1 });
    this.createTrack({ title: "Cyber Night", albumId: neonHorizon.id, artistId: cyberDreams.id, duration: 195, trackNumber: 2 });
    this.createTrack({ title: "Digital Echo", albumId: neonHorizon.id, artistId: cyberDreams.id, duration: 243, trackNumber: 3 });
    this.createTrack({ title: "Future Fade", albumId: neonHorizon.id, artistId: cyberDreams.id, duration: 187, trackNumber: 4 });
    
    // Create tracks for Electric Dreams
    this.createTrack({ title: "Neon Lights", albumId: electricDreams.id, artistId: lunaRay.id, duration: 255, trackNumber: 1 });
    this.createTrack({ title: "Starlight", albumId: electricDreams.id, artistId: lunaRay.id, duration: 212, trackNumber: 2 });
    this.createTrack({ title: "Moonbeam", albumId: electricDreams.id, artistId: lunaRay.id, duration: 228, trackNumber: 3 });
    
    // Create tracks for Synth Wave
    this.createTrack({ title: "Digital Dreams", albumId: synthWave.id, artistId: digitalPulse.id, duration: 238, trackNumber: 1 });
    this.createTrack({ title: "Pulse Wave", albumId: synthWave.id, artistId: digitalPulse.id, duration: 204, trackNumber: 2 });
    this.createTrack({ title: "Binary Code", albumId: synthWave.id, artistId: digitalPulse.id, duration: 197, trackNumber: 3 });
    
    // Create tracks for Midnight Forest
    this.createTrack({ title: "Deep Woods", albumId: midnightForest.id, artistId: echoChamber.id, duration: 275, trackNumber: 1 });
    this.createTrack({ title: "Twilight Path", albumId: midnightForest.id, artistId: echoChamber.id, duration: 246, trackNumber: 2 });
    
    // Create tracks for Urban Beats
    this.createTrack({ title: "City Lights", albumId: urbanBeats.id, artistId: metroSound.id, duration: 232, trackNumber: 1 });
    this.createTrack({ title: "Midnight Drive", albumId: urbanBeats.id, artistId: metroSound.id, duration: 219, trackNumber: 2 });
    
    // Create user
    const user = this.createUser({ username: "musiclover", password: "password123" });
    
    // Create playlists
    const chillVibes = this.createPlaylist({ name: "Chill Vibes", userId: user.id, imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17" });
    const workoutMix = this.createPlaylist({ name: "Workout Mix", userId: user.id, imageUrl: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8" });
    const throwbackHits = this.createPlaylist({ name: "Throwback Hits", userId: user.id, imageUrl: "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0" });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Artist operations
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const id = this.artistIdCounter++;
    const newArtist: Artist = { ...artist, id };
    this.artists.set(id, newArtist);
    return newArtist;
  }

  // Album operations
  async getAlbum(id: number): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async getAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getAlbumsByArtist(artistId: number): Promise<Album[]> {
    return Array.from(this.albums.values()).filter(album => album.artistId === artistId);
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    const id = this.albumIdCounter++;
    const newAlbum: Album = { ...album, id };
    this.albums.set(id, newAlbum);
    return newAlbum;
  }

  // Track operations
  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTracksByAlbum(albumId: number): Promise<Track[]> {
    return Array.from(this.tracks.values())
      .filter(track => track.albumId === albumId)
      .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
  }

  async getTracksByArtist(artistId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(track => track.artistId === artistId);
  }

  async createTrack(track: InsertTrack): Promise<Track> {
    const id = this.trackIdCounter++;
    const newTrack: Track = { ...track, id };
    this.tracks.set(id, newTrack);
    return newTrack;
  }

  // Playlist operations
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getPlaylistsByUser(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(playlist => playlist.userId === userId);
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const id = this.playlistIdCounter++;
    const newPlaylist: Playlist = { ...playlist, id, createdAt: new Date() };
    this.playlists.set(id, newPlaylist);
    return newPlaylist;
  }

  async updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist | undefined> {
    const existingPlaylist = this.playlists.get(id);
    if (!existingPlaylist) return undefined;
    
    const updatedPlaylist = { ...existingPlaylist, ...playlist };
    this.playlists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    return this.playlists.delete(id);
  }

  // Playlist tracks operations
  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const playlistTrackEntries = Array.from(this.playlistTracks.values())
      .filter(pt => pt.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);
    
    return playlistTrackEntries.map(pt => {
      const track = this.tracks.get(pt.trackId);
      if (!track) throw new Error(`Track with id ${pt.trackId} not found`);
      return track;
    });
  }

  async addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const id = this.playlistTrackIdCounter++;
    const newPlaylistTrack: PlaylistTrack = { ...playlistTrack, id };
    this.playlistTracks.set(id, newPlaylistTrack);
    return newPlaylistTrack;
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<boolean> {
    const entryToRemove = Array.from(this.playlistTracks.entries()).find(
      ([_, pt]) => pt.playlistId === playlistId && pt.trackId === trackId
    );
    
    if (!entryToRemove) return false;
    
    return this.playlistTracks.delete(entryToRemove[0]);
  }

  async reorderPlaylistTrack(playlistId: number, trackId: number, newPosition: number): Promise<boolean> {
    const playlistTrackEntries = Array.from(this.playlistTracks.entries())
      .filter(([_, pt]) => pt.playlistId === playlistId)
      .sort((a, b) => a[1].position - b[1].position);
    
    const trackToMove = playlistTrackEntries.find(([_, pt]) => pt.trackId === trackId);
    if (!trackToMove) return false;
    
    const [id, pt] = trackToMove;
    const updatedPt = { ...pt, position: newPosition };
    this.playlistTracks.set(id, updatedPt);
    
    // Reorder other tracks as needed
    playlistTrackEntries
      .filter(([currentId, _]) => currentId !== id)
      .forEach(([currentId, currentPt]) => {
        if (newPosition <= currentPt.position && currentPt.position < pt.position) {
          this.playlistTracks.set(currentId, { ...currentPt, position: currentPt.position + 1 });
        } else if (pt.position < currentPt.position && currentPt.position <= newPosition) {
          this.playlistTracks.set(currentId, { ...currentPt, position: currentPt.position - 1 });
        }
      });
    
    return true;
  }

  // Recently played operations
  async getRecentlyPlayed(userId: number, limit: number = 10): Promise<{ track: Track; album: Album; artist: Artist }[]> {
    const recentlyPlayedEntries = Array.from(this.recentlyPlayed.values())
      .filter(rp => rp.userId === userId)
      .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime())
      .slice(0, limit);
    
    return recentlyPlayedEntries.map(rp => {
      const track = this.tracks.get(rp.trackId);
      if (!track) throw new Error(`Track with id ${rp.trackId} not found`);
      
      const album = this.albums.get(track.albumId);
      if (!album) throw new Error(`Album with id ${track.albumId} not found`);
      
      const artist = this.artists.get(track.artistId);
      if (!artist) throw new Error(`Artist with id ${track.artistId} not found`);
      
      return { track, album, artist };
    });
  }

  async addRecentlyPlayed(recentlyPlayed: InsertRecentlyPlayed): Promise<RecentlyPlayed> {
    const id = this.recentlyPlayedIdCounter++;
    const newRecentlyPlayed: RecentlyPlayed = { ...recentlyPlayed, id, playedAt: new Date() };
    this.recentlyPlayed.set(id, newRecentlyPlayed);
    return newRecentlyPlayed;
  }
}

export const storage = new MemStorage();
