import { db } from './storage';
import * as schema from '../shared/schema';
import { InsertArtist, InsertAlbum, InsertTrack, InsertUser, InsertPlaylist, InsertPlaylistTrack, InsertRecentlyPlayed } from '../shared/schema';
import { eq, and } from 'drizzle-orm'; 
import * as bcrypt from 'bcryptjs'; // Import bcryptjs

const artistsData: Omit<InsertArtist, 'id'>[] = [
  { name: "Cyber Dreams", imageUrl: "https://images.unsplash.com/photo-1593697972672-b1c1074e69e9", description: "Electronic music producer known for futuristic sounds" },
  { name: "Luna Ray", imageUrl: "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8", description: "Indie pop artist with ethereal vocals" },
  { name: "Digital Pulse", imageUrl: "https://images.unsplash.com/photo-1520785643438-5bf77931f493", description: "EDM collective with energetic beats" },
  { name: "Echo Chamber", imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a", description: "Ambient music composer focusing on atmospheric sounds" },
  { name: "Metro Sound", imageUrl: "https://images.unsplash.com/photo-1514533212735-5df27d970db0", description: "Urban music producer with a knack for rhythmic beats" },
];

const albumsSeedData: { title: string; artistName: string; imageUrl: string; releaseYear: number; dominantColor: string; tracks: Omit<InsertTrack, 'id' | 'albumId' | 'artistId'>[] }[] = [
  {
    title: "Neon Horizon", artistName: "Cyber Dreams", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17", releaseYear: 2023, dominantColor: "#9D4EDD",
    tracks: [
      { title: "Solar Flare", duration: 222, trackNumber: 1 },
      { title: "Cyber Night", duration: 195, trackNumber: 2 },
      { title: "Digital Echo", duration: 243, trackNumber: 3 },
      { title: "Future Fade", duration: 187, trackNumber: 4 },
    ]
  },
  {
    title: "Electric Dreams", artistName: "Luna Ray", imageUrl: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8", releaseYear: 2022, dominantColor: "#3E78B2",
    tracks: [
      { title: "Neon Lights", duration: 255, trackNumber: 1 },
      { title: "Starlight", duration: 212, trackNumber: 2 },
      { title: "Moonbeam", duration: 228, trackNumber: 3 },
    ]
  },
  {
    title: "Synth Wave", artistName: "Digital Pulse", imageUrl: "https://images.unsplash.com/photo-1614613534528-3c6d0a9a8774", releaseYear: 2023, dominantColor: "#FF6B6B",
    tracks: [
      { title: "Digital Dreams", duration: 238, trackNumber: 1 },
      { title: "Pulse Wave", duration: 204, trackNumber: 2 },
      { title: "Binary Code", duration: 197, trackNumber: 3 },
    ]
  },
  {
    title: "Midnight Forest", artistName: "Echo Chamber", imageUrl: "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0", releaseYear: 2021, dominantColor: "#00F5D4",
    tracks: [
      { title: "Deep Woods", duration: 275, trackNumber: 1 },
      { title: "Twilight Path", duration: 246, trackNumber: 2 },
    ]
  },
  {
    title: "Urban Beats", artistName: "Metro Sound", imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7", releaseYear: 2022, dominantColor: "#240046",
    tracks: [
      { title: "City Lights", duration: 232, trackNumber: 1 },
      { title: "Midnight Drive", duration: 219, trackNumber: 2 },
    ]
  },
];

const usersData: Omit<InsertUser, 'id' | 'password'> & { passwordRaw: string }[] = [
  { username: "musiclover", passwordRaw: "password123" } 
];

// Define which tracks to add to which playlists by title/trackNumber for simplicity
const playlistsData: { name: string; userName: string; imageUrl: string; tracksToAdd?: { albumTitle: string, trackTitle: string }[] }[] = [
  { 
    name: "Chill Vibes", userName: "musiclover", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
    tracksToAdd: [
      { albumTitle: "Neon Horizon", trackTitle: "Future Fade" },
      { albumTitle: "Midnight Forest", trackTitle: "Twilight Path" },
    ]
  },
  { 
    name: "Workout Mix", userName: "musiclover", imageUrl: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8",
    tracksToAdd: [
      { albumTitle: "Synth Wave", trackTitle: "Pulse Wave" },
      { albumTitle: "Urban Beats", trackTitle: "City Lights" },
    ]
  },
  { name: "Throwback Hits", userName: "musiclover", imageUrl: "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0" },
];


async function seed() {
  console.log("Starting database seeding...");

  console.log("Clearing existing data (if any)...");
  await db.delete(schema.playlistTracks).execute();
  await db.delete(schema.recentlyPlayed).execute();
  await db.delete(schema.tracks).execute();
  await db.delete(schema.playlists).execute();
  await db.delete(schema.albums).execute();
  await db.delete(schema.artists).execute();
  await db.delete(schema.users).execute();
  console.log("Cleared existing data.");

  // Seed Artists
  const insertedArtists = await db.insert(schema.artists).values(artistsData).returning();
  console.log(`Seeded ${insertedArtists.length} artists`);
  const artistMap = new Map(insertedArtists.map(a => [a.name, a]));

  // Seed Albums and their Tracks
  const allInsertedTracks: schema.Track[] = [];
  for (const albumSeed of albumsSeedData) {
    const artist = artistMap.get(albumSeed.artistName);
    if (!artist) {
      console.warn(`Artist ${albumSeed.artistName} not found for album ${albumSeed.title}. Skipping album.`);
      continue;
    }

    const [insertedAlbum] = await db.insert(schema.albums).values({
      title: albumSeed.title,
      artistId: artist.id,
      imageUrl: albumSeed.imageUrl,
      releaseYear: albumSeed.releaseYear,
      dominantColor: albumSeed.dominantColor,
    }).returning();
    console.log(`Seeded album: ${insertedAlbum.title}`);

    if (insertedAlbum && albumSeed.tracks.length > 0) {
      const tracksToInsert = albumSeed.tracks.map(track => ({
        ...track,
        albumId: insertedAlbum.id,
        artistId: artist.id,
      }));
      const insertedTracks = await db.insert(schema.tracks).values(tracksToInsert).returning();
      allInsertedTracks.push(...insertedTracks);
      console.log(`Seeded ${insertedTracks.length} tracks for album: ${insertedAlbum.title}`);
    }
  }
  const trackMap = new Map(allInsertedTracks.map(t => [`${t.title}-${t.albumId}`, t]));


  // Seed Users (with hashed passwords)
  const usersToInsert = usersData.map(user => ({
    username: user.username,
    password: bcrypt.hashSync(user.passwordRaw, 10) 
  }));
  const insertedUsers = await db.insert(schema.users).values(usersToInsert).returning();
  console.log(`Seeded ${insertedUsers.length} users (with hashed passwords)`);
  const userMap = new Map(insertedUsers.map(u => [u.username, u]));

  // Seed Playlists and PlaylistTracks
  for (const playlistSeed of playlistsData) {
    const user = userMap.get(playlistSeed.userName);
    if (!user) {
      console.warn(`User ${playlistSeed.userName} not found for playlist ${playlistSeed.name}. Skipping playlist.`);
      continue;
    }
    const [insertedPlaylist] = await db.insert(schema.playlists).values({
      name: playlistSeed.name,
      userId: user.id,
      imageUrl: playlistSeed.imageUrl,
    }).returning();
    console.log(`Seeded playlist: ${insertedPlaylist.name}`);

    if (insertedPlaylist && playlistSeed.tracksToAdd) {
      let position = 1;
      for (const trackIdentifier of playlistSeed.tracksToAdd) {
        // Find album first to get its ID
        const targetAlbum = (await db.query.albums.findMany({ where: eq(schema.albums.title, trackIdentifier.albumTitle) }))[0];
        if (!targetAlbum) {
            console.warn(`Album "${trackIdentifier.albumTitle}" not found. Skipping track "${trackIdentifier.trackTitle}" for playlist "${insertedPlaylist.name}".`);
            continue;
        }

        // Find track by title and albumId
        const targetTrack = (await db.query.tracks.findMany({ 
            where: and( 
                eq(schema.tracks.title, trackIdentifier.trackTitle),
                eq(schema.tracks.albumId, targetAlbum.id)
            )
        }))[0];

        if (targetTrack) {
          await db.insert(schema.playlistTracks).values({
            playlistId: insertedPlaylist.id,
            trackId: targetTrack.id,
            position: position++,
          }).execute();
          console.log(`Added track "${targetTrack.title}" to playlist "${insertedPlaylist.name}"`);
        } else {
          console.warn(`Track "${trackIdentifier.trackTitle}" (Album: "${trackIdentifier.albumTitle}") not found. Skipping for playlist "${insertedPlaylist.name}".`);
        }
      }
    }
  }

  // Seed RecentlyPlayed
  if (insertedUsers.length > 0 && allInsertedTracks.length > 0) {
    const user1 = insertedUsers[0];
    const recentlyPlayedData: Omit<InsertRecentlyPlayed, 'id' | 'playedAt'>[] = [
      { userId: user1.id, trackId: allInsertedTracks[0].id }, // Play the first track
      { userId: user1.id, trackId: allInsertedTracks[Math.min(1, allInsertedTracks.length - 1)].id }, // Play the second track if available
    ];
    if (allInsertedTracks.length > 2) { // Add a third one if possible
        recentlyPlayedData.push({ userId: user1.id, trackId: allInsertedTracks[2].id });
    }

    await db.insert(schema.recentlyPlayed).values(recentlyPlayedData).execute();
    console.log(`Seeded ${recentlyPlayedData.length} recently played entries for user ${user1.username}`);
  }

  console.log("Database seeding complete.");
  // Explicitly exit the process, otherwise it might hang due to the open DB connection
  // This is important for script execution.
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
