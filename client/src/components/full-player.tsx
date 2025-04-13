import { usePlayer } from "@/context/player-context";
import { formatDuration } from "@/lib/mockdata";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Visualizer from "./visualizer";

interface FullPlayerProps {
  onClose: () => void;
}

const FullPlayer = ({ onClose }: FullPlayerProps) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    nextTrack, 
    previousTrack, 
    playbackProgress, 
    currentTime, 
    duration,
    seekTo,
    volume,
    setVolume,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat
  } = usePlayer();

  const [seekValue, setSeekValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Update seek slider when currentTime changes (unless user is dragging)
  useEffect(() => {
    if (!isDragging) {
      setSeekValue(currentTime);
    }
  }, [currentTime, isDragging]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSeekValue(value);
  };

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = () => {
    seekTo(seekValue);
    setIsDragging(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  if (!currentTrack) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#3C096C] to-[#10002B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col p-6 md:p-10">
        {/* Player header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            className="bg-white bg-opacity-10 hover:bg-opacity-20 transition-all rounded-full w-10 h-10 flex items-center justify-center"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="font-clash text-xl">Now Playing</h2>
            <p className="text-gray-400 text-sm">From: {currentTrack.album?.title || "Unknown Album"}</p>
          </div>
          
          <button className="bg-white bg-opacity-10 hover:bg-opacity-20 transition-all rounded-full w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
        
        {/* Album art and visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <Visualizer isPlaying={isPlaying} />
          
          {/* Album cover */}
          <motion.div 
            className="z-10 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden border-4 border-white border-opacity-10 shadow-2xl ${isPlaying ? 'album-rotation' : ''}`}>
              <img 
                src={currentTrack.album?.imageUrl} 
                alt={`${currentTrack.title} album cover`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#10002B] rounded-full border-2 border-white border-opacity-20"></div>
          </motion.div>
        </div>
        
        {/* Track info */}
        <motion.div 
          className="mt-8 mb-4 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="font-clash font-bold text-3xl mb-1">{currentTrack.title}</h2>
          <p className="text-gray-400">{currentTrack.artist?.name}</p>
        </motion.div>
        
        {/* Playback progress */}
        <div className="mb-8">
          <div className="relative h-1 bg-white bg-opacity-10 rounded-full mb-2">
            <input
              type="range"
              min={0}
              max={duration}
              value={seekValue}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute h-full bg-highlight rounded-full" 
              style={{ width: `${playbackProgress}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
        
        {/* Playback controls */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <button 
            className={`text-2xl ${shuffle ? 'text-highlight' : 'hover:text-highlight'} transition-colors`}
            onClick={toggleShuffle}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            className="text-3xl hover:text-highlight transition-colors"
            onClick={previousTrack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="bg-primary hover:bg-opacity-80 transition-all rounded-full w-16 h-16 flex items-center justify-center shadow-lg shadow-primary/30"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button 
            className="text-3xl hover:text-highlight transition-colors"
            onClick={nextTrack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
          <button 
            className={`text-2xl ${repeat !== 'none' ? 'text-highlight' : 'hover:text-highlight'} transition-colors`}
            onClick={toggleRepeat}
          >
            {repeat === 'one' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15M9 12l3 3m0 0l3-3m-3 3V6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Extra controls */}
        <div className="flex justify-center items-center space-x-6">
          <button className="text-xl hover:text-highlight transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <button className="text-xl hover:text-highlight transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.001l4.293-4.293a1 1 0 011.414 0l4.293 4.293a5 5 0 01-7.071 7.072L5.586 15.465z" />
              </svg>
            </button>
            <div className="w-24 h-1 bg-white bg-opacity-20 rounded-full relative">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-white bg-opacity-60 rounded-full" 
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
          </div>
          <button className="text-xl hover:text-highlight transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FullPlayer;
