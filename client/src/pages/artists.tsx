import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface Artist {
  id: number;
  name: string;
  imageUrl?: string;
  bio?: string;
  albumCount?: number;
}

const ArtistCard = ({ artist }: { artist: Artist }) => {
  const [, navigate] = useLocation();

  return (
    <motion.div 
      className="glassmorphism rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img 
          src={artist.imageUrl || '/placeholder-artist.jpg'} 
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold truncate">{artist.name}</h3>
        <p className="text-sm text-white/60">
          {artist.albumCount ? `${artist.albumCount} albums` : "No albums"}
        </p>
      </div>
    </motion.div>
  );
};

const Artists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['/api/artists'],
    staleTime: 60000,
  });

  // Filter artists based on search query
  const filteredArtists = Array.isArray(artists) 
    ? artists.filter((artist: Artist) => 
        artist.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl md:text-4xl font-clash font-bold mb-6">Artists</h1>
          
          {/* Search */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 bg-background/30 border-primary/20"
            />
          </div>
        </motion.div>

        {/* Artists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 md:h-48 bg-white/10 rounded-xl mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {filteredArtists.map((artist: Artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">No Artists Found</h2>
            <p className="text-white/60">
              {searchQuery ? "Try a different search term" : "There are no artists available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists; 