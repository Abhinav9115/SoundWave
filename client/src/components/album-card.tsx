import { Album, Track, usePlayer } from "@/context/player-context";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Store player state locally
  const [isCurrentAlbumPlaying, setIsCurrentAlbumPlaying] = useState(false);
  
  // Fetch tracks for this album to enable play functionality
  const { data: albumTracks } = useQuery({
    queryKey: [`/api/albums/${album.id}/tracks`],
    enabled: !!album.id,
    staleTime: 60000,
  });

  // Safely use player context
  let playerContext;
  try {
    playerContext = usePlayer();
    
    // Update our state when player context changes
    useEffect(() => {
      if (playerContext) {
        setIsCurrentAlbumPlaying(
          playerContext.isPlaying && 
          playerContext.currentTrack?.albumId === album.id
        );
      }
    }, [
      playerContext.isPlaying, 
      playerContext.currentTrack, 
      album.id
    ]);
  } catch (error) {
    // Context not available, we'll use default values
    console.log("Player context not available");
  }

  const handleClick = () => {
    navigate(`/album/${album.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking play button
    
    // Only proceed if we have player context
    if (!playerContext) {
      toast({
        title: "Player not ready",
        description: "Please try again in a moment",
      });
      return;
    }
    
    // If we have tracks for this album
    if (albumTracks && albumTracks.length > 0) {
      // If currently playing from this album, toggle play/pause
      if (playerContext.currentTrack?.albumId === album.id) {
        playerContext.togglePlayPause();
      } else {
        // Start playing the first track
        playerContext.playTrack(albumTracks[0]);
      }
    } else {
      toast({
        title: "No tracks available",
        description: `No tracks found for ${album.title}`,
      });
    }
  };

  return (
    <motion.div 
      className="group cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative overflow-hidden rounded-xl aspect-square mb-3 transform transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={album.imageUrl} 
          alt={`${album.title} album cover`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button 
            className={`${isCurrentAlbumPlaying ? 'bg-highlight' : 'bg-primary'} rounded-full w-12 h-12 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
          >
            {isCurrentAlbumPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.div>
      <h3 className="font-medium text-lg">{album.title}</h3>
      <p className="text-gray-400 text-sm">{album.artist?.name}</p>
    </motion.div>
  );
};

export default AlbumCard;
