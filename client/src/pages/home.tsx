import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AlbumCard from "@/components/album-card";
import TrackCard from "@/components/track-card";
import ArtistCard from "@/components/artist-card";
import { motion } from "framer-motion";
import { Album, Artist, Track } from "@/context/player-context";

// Define the shape of the recently played item returned by the API
type RecentlyPlayedItem = {
  track: Track;
  album: Album;
  artist: Artist;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured albums
  const { data: albums, isLoading: isLoadingAlbums } = useQuery<Album[]>({
    queryKey: ['/api/albums'],
    staleTime: 60000,
  });

  // Fetch recently played tracks
  const { data: recentlyPlayed, isLoading: isLoadingRecent } = useQuery<RecentlyPlayedItem[]>({
    queryKey: ['/api/recently-played'],
    staleTime: 60000,
  });

  // Fetch popular artists
  const { data: artists, isLoading: isLoadingArtists } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    staleTime: 60000,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header with search */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-highlight transition-all"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="glassmorphism rounded-full p-2 hover:bg-primary hover:bg-opacity-30 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="glassmorphism rounded-full p-2 hover:bg-primary hover:bg-opacity-30 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="font-medium">MS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-clash font-bold text-3xl mb-6">Featured Albums</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoadingAlbums ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/10 rounded-xl aspect-square mb-3"></div>
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              // Actual albums
              albums?.map((album: Album) => (
                <AlbumCard key={album.id} album={album} />
              ))
            )}
          </div>
        </motion.div>

        {/* Recently Played */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-clash font-bold text-2xl mb-6">Recently Played</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingRecent ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glassmorphism rounded-xl p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/10 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual recently played tracks
              recentlyPlayed?.map((item: RecentlyPlayedItem, index: number) => (
                <TrackCard 
                  key={`${item.track.id}-${index}`} 
                  track={item.track} 
                  animationDelay={index * 0.1}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Popular Artists */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="font-clash font-bold text-2xl mb-6">Popular Artists</h2>
          
          <div className="flex space-x-6 overflow-x-auto pb-4 custom-scrollbar">
            {isLoadingArtists ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-3 flex-shrink-0 animate-pulse">
                  <div className="w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="h-4 bg-white/10 rounded w-16"></div>
                </div>
              ))
            ) : (
              // Actual artists
              artists?.map((artist: Artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
