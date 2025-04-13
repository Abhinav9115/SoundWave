import { Track, Album, Artist } from "../context/player-context";

// Album covers from Unsplash
export const albumCovers = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
  "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8",
  "https://images.unsplash.com/photo-1614613534528-3c6d0a9a8774",
  "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
  "https://images.unsplash.com/photo-1630828966770-476510810f63",
  "https://images.unsplash.com/photo-1578946956088-940c3b502864",
  "https://images.unsplash.com/photo-1619983081563-430f63602de6",
  "https://images.unsplash.com/photo-1626285581521-eaaff7eff7b9",
  "https://images.unsplash.com/photo-1514982438069-94a0c898d7a3"
];

// Artist portraits from Unsplash
export const artistImages = [
  "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8",
  "https://images.unsplash.com/photo-1593697972672-b1c1074e69e9",
  "https://images.unsplash.com/photo-1520785643438-5bf77931f493",
  "https://images.unsplash.com/photo-1534126511673-b6899657816a",
  "https://images.unsplash.com/photo-1514533212735-5df27d970db0"
];

// Format duration in MM:SS
export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Generate a random duration between 2 and 5 minutes
export const getRandomDuration = () => {
  return Math.floor(Math.random() * (300 - 120 + 1)) + 120;
};

// Sample playlist data
export const playlists = [
  {
    id: 1,
    name: "Chill Vibes",
    imageColor: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "Workout Mix",
    imageColor: "from-blue-500 to-green-500"
  },
  {
    id: 3,
    name: "Throwback Hits",
    imageColor: "from-yellow-500 to-red-500"
  }
];
