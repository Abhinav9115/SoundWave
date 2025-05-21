import { Track } from "@/context/player-context";
import { usePlayer } from "@/context/player-context";
import { formatDuration } from "@/lib/mockdata"; // Assuming this is a valid utility
import { motion } from "framer-motion"; // Keep for entry animation if desired
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TrackCardProps {
  track: Track;
  style?: React.CSSProperties; // For potential inline styles from parent
  animationDelay?: number; // For staggered entry animations
}

const TrackCard = ({ track, style, animationDelay = 0 }: TrackCardProps) => {
  const { toast } = useToast();
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);
  
  let playerContext;
  try {
    playerContext = usePlayer();
    useEffect(() => {
      if (playerContext) {
        const currentlyPlaying = playerContext.currentTrack?.id === track.id;
        setIsCurrentTrack(currentlyPlaying);
        setIsCurrentlyPlaying(currentlyPlaying && playerContext.isPlaying);
      }
    }, [playerContext?.currentTrack, playerContext?.isPlaying, track.id]);
  } catch (error) {
    console.log("Player context not available in track card");
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent playing if the click target was the play/pause button itself
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handlePlayPause();
  };
  
  const handlePlayPause = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation(); // Prevent card click if button is clicked
    if (!playerContext) {
      toast({ title: "Player not ready", description: "Please try again in a moment" });
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
      className="group bg-card/50 hover:bg-card/70 rounded-xl p-4 flex items-center space-x-4 transition-all duration-200 ease-in-out cursor-pointer transform hover:scale-[1.02] focus-within:scale-[1.02] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
      style={{ ...style, animationDelay: `${animationDelay}s` }} // Keep existing style and animationDelay props
      initial={{ opacity: 0, y: 20 }} // Keep entry animation
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      onClick={handleCardClick}
      tabIndex={0} // Make it focusable
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayPause(); }}
    >
      <img 
        src={track.album?.imageUrl || '/placeholder-album.png'} // Fallback image
        alt={track.album?.title || 'Album cover'}
        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : 'group-hover:text-primary/80'}`}>{track.title}</h3>
        <p className="text-gray-400 text-sm truncate">{track.artist?.name || 'Unknown Artist'}</p>
      </div>
      <div className="text-right flex flex-col items-center">
        <p className="text-gray-400 text-sm mb-1">{formatDuration(track.duration)}</p>
        <button 
          className={`p-1 rounded-full transition-colors duration-200 ${isCurrentTrack ? 'text-primary hover:text-primary/80' : 'text-gray-400 hover:text-white group-hover:text-primary/80'}`} 
          onClick={handlePlayPause}
          aria-label={isCurrentTrack && isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          {isCurrentTrack && isCurrentlyPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 002 0V9a1 1 0 00-1-1zm6 0a1 1 0 00-1 1v2a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664l-3.197-1.882z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default TrackCard;
