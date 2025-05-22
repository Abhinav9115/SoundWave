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
    <div // Changed from motion.div for simpler Tailwind transitions
      className="group cursor-pointer p-3 bg-card/50 hover:bg-card/70 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.03] focus-within:scale-[1.03] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
      onClick={handleClick}
      tabIndex={0} // Make it focusable
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div 
        className="relative overflow-hidden rounded-md aspect-square mb-3 shadow-lg group-hover:shadow-xl group-focus-within:shadow-xl transition-shadow duration-300"
      >
        <img 
          src={album.imageUrl} 
          alt={`${album.title} album cover`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-focus-within:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button // Changed from motion.button
            className={`${isCurrentAlbumPlaying ? 'bg-highlight hover:bg-highlight/90' : 'bg-primary hover:bg-primary/90'} text-white rounded-full w-12 h-12 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50`}
            onClick={handlePlay}
            aria-label={isCurrentAlbumPlaying ? `Pause ${album.title}` : `Play ${album.title}`}
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
          </button>
        </div>
      </div>
      <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors duration-300">{album.title}</h3>
      <p className="text-gray-400 text-sm truncate">{album.artist?.name || 'Unknown Artist'}</p>
    </div>
  );
};

export default AlbumCard;
