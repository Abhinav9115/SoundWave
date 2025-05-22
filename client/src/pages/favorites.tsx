import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import TrackCard from "@/components/track-card";
import AlbumCard from "@/components/album-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Favorites = () => {
  // In a real app, this would come from an API call with the user's favorites
  // For now, we'll simulate it with a query
  const { data: favoriteTracks = [], isLoading: isLoadingTracks } = useQuery({
    queryKey: ['/api/user/favorites/tracks'],
    staleTime: 60000,
  });
  
  const { data: favoriteAlbums = [], isLoading: isLoadingAlbums } = useQuery({
    queryKey: ['/api/user/favorites/albums'],
    staleTime: 60000,
  });

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-clash font-bold mb-6">Your Favorites</h1>
          
          <Tabs defaultValue="tracks" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tracks">
              {isLoadingTracks ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse h-24 bg-white/10 rounded-xl"></div>
                  ))}
                </div>
              ) : Array.isArray(favoriteTracks) && favoriteTracks.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {favoriteTracks.map((track: any, index: number) => (
                    <TrackCard 
                      key={track.id} 
                      track={track} 
                      animationDelay={index * 0.05}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h2 className="text-2xl font-bold mb-2">No Favorite Tracks</h2>
                  <p className="text-white/60 mb-6">You haven't added any tracks to your favorites yet.</p>
                  <button 
                    className="bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                    onClick={() => window.location.href = '/songs'}
                  >
                    Explore Songs
                  </button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="albums">
              {isLoadingAlbums ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-white/10 rounded-xl mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(favoriteAlbums) && favoriteAlbums.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {favoriteAlbums.map((album: any) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h2 className="text-2xl font-bold mb-2">No Favorite Albums</h2>
                  <p className="text-white/60 mb-6">You haven't added any albums to your favorites yet.</p>
                  <button 
                    className="bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                    onClick={() => window.location.href = '/'}
                  >
                    Explore Albums
                  </button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Favorites; 