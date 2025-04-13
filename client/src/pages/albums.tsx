import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Album } from "@/context/player-context";
import AlbumCard from "@/components/album-card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Albums = () => {
  const [filterValue, setFilterValue] = useState("");
  const { toast } = useToast();
  
  // Fetch all albums
  const { data: albums, isLoading } = useQuery({
    queryKey: ['/api/albums'],
    staleTime: 60000,
  });

  // Filter albums based on search input
  const filteredAlbums = albums ? 
    albums.filter((album: any) => 
      album.title.toLowerCase().includes(filterValue.toLowerCase()) ||
      (album.artist?.name || '').toLowerCase().includes(filterValue.toLowerCase())
    ) : 
    [];

  // Display a message when creating a new album
  const handleCreateAlbum = () => {
    toast({
      title: "Create Album",
      description: "Album creation will be available soon!",
    });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    toast({
      title: "Sort Albums",
      description: `Albums will be sorted by ${e.target.value}`,
    });
  };

  if (isLoading) {
    return (
      <div className="p-5 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/10 rounded w-1/4 mb-6"></div>
            <div className="flex justify-between mb-8">
              <div className="h-12 bg-white/10 rounded w-64"></div>
              <div className="h-12 bg-white/10 rounded w-40"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-72 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Instead of using motion(AlbumCard) which has type issues, we'll use this approach:
  const albumContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.4
      }
    })
  };

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl md:text-4xl font-clash font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Albums
        </motion.h1>
        
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="Filter albums..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-highlight transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <select 
              className="bg-white/10 border-2 border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-highlight transition-colors cursor-pointer"
              onChange={handleSortChange}
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="year">Release Year</option>
            </select>
            
            <button 
              onClick={handleCreateAlbum}
              className="bg-highlight text-black font-medium rounded-lg px-5 py-3 flex items-center hover:bg-opacity-90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Album
            </button>
          </div>
        </motion.div>
        
        {filteredAlbums.length === 0 ? (
          <motion.div 
            className="text-center py-16 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No albums found</h2>
            <p>{filterValue ? `No results for "${filterValue}"` : 'Your album collection is empty'}</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {filteredAlbums.map((album: Album, index: number) => (
              <motion.div
                key={album.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={albumContainerVariants}
              >
                <AlbumCard album={album} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Albums;