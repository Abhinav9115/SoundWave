import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import TrackCard from "@/components/track-card";
import { Input } from "@/components/ui/input";
import { usePlayer } from "@/context/player-context";

const Songs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['/api/tracks'],
    staleTime: 60000,
  });

  // Filter tracks based on search query
  const filteredTracks = Array.isArray(tracks) 
    ? tracks.filter((track: any) => 
        track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-clash font-bold mb-6">All Songs</h1>
          
          {/* Search */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search songs or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 bg-background/30 border-primary/20"
            />
          </div>
        </motion.div>

        {/* Tracks List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse h-24 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        ) : filteredTracks.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {filteredTracks.map((track: any, index: number) => (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">No Songs Found</h2>
            <p className="text-white/60">
              {searchQuery ? "Try a different search term" : "There are no songs available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs; 