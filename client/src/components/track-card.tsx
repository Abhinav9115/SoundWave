import { Track } from "@/context/player-context";
import { usePlayer } from "@/context/player-context";
import { formatDuration } from "@/lib/mockdata";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TrackCardProps {
  track: Track;
  style?: React.CSSProperties;
  animationDelay?: number;
}

const TrackCard = ({ track, style, animationDelay = 0 }: TrackCardProps) => {
  const { toast } = useToast();
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);
  
  // Safely use player context
  let playerContext;
  try {
    playerContext = usePlayer();
    
    // Update our local state when player context changes
    useEffect(() => {
      if (playerContext) {
        const currentlyPlaying = playerContext.currentTrack?.id === track.id;
        setIsCurrentTrack(currentlyPlaying);
        setIsCurrentlyPlaying(currentlyPlaying && playerContext.isPlaying);
      }
    }, [
      playerContext.currentTrack, 
      playerContext.isPlaying, 
      track.id
    ]);
  } catch (error) {
    // Context not available, we'll use default values
    console.log("Player context not available in track card");
  }

  const handlePlay = () => {
    // Make sure the player context is available
    if (!playerContext) {
      toast({
        title: "Player not ready",
        description: "Please try again in a moment",
      });
      return;
    }
    
    if (isCurrentTrack) {
      playerContext.togglePlayPause();
    } else {
      playerContext.playTrack(track);
    }
  };

  return (
    <motion.div 
      className="glassmorphism rounded-xl p-4 flex items-center space-x-4 hover:bg-opacity-40 transition-all cursor-pointer animate-float"
      style={{ 
        ...style,
        animationDelay: `${animationDelay}s`
      }}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      onClick={handlePlay}
    >
      <img 
        src={track.album?.imageUrl}
        alt={`${track.title} album cover`}
        className="w-14 h-14 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${isCurrentTrack ? 'text-highlight' : ''}`}>{track.title}</h3>
        <p className="text-gray-400 text-sm truncate">{track.artist?.name}</p>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">{formatDuration(track.duration)}</p>
        <button className={`text-xl ${isCurrentTrack ? 'text-highlight' : ''} mt-1`} onClick={handlePlay}>
          {isCurrentTrack && isCurrentlyPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default TrackCard;
