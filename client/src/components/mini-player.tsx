import { usePlayer } from "@/context/player-context";
import { formatDuration } from "@/lib/mockdata";
import { useLocation } from "wouter";

const MiniPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    nextTrack, 
    previousTrack, 
    playbackProgress,
    currentTime,
  } = usePlayer();
  const [_, navigate] = useLocation();

  const handleOpenPlayer = () => {
    navigate('/player');
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 glassmorphism border-t border-white border-opacity-10 py-3 px-4 z-20">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Track info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img 
            src={currentTrack.album?.imageUrl} 
            alt={`${currentTrack.title} album cover`}
            className="w-12 h-12 rounded-md object-cover"
            onClick={handleOpenPlayer}
          />
          <div className="min-w-0">
            <h3 className="font-medium truncate">{currentTrack.title}</h3>
            <p className="text-gray-400 text-xs truncate">{currentTrack.artist?.name}</p>
          </div>
          <button className="flex-shrink-0 text-xl ml-3 hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Playback controls for medium screens */}
        <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
          <button 
            className="text-xl hover:text-highlight transition-colors"
            onClick={previousTrack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="bg-primary hover:bg-opacity-80 transition-all rounded-full w-10 h-10 flex items-center justify-center"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button 
            className="text-xl hover:text-highlight transition-colors"
            onClick={nextTrack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar and expand for small screens */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <div className="relative h-1 bg-white bg-opacity-10 rounded-full flex-1 hidden sm:block max-w-xs">
            <div 
              className="absolute h-full bg-highlight rounded-full" 
              style={{ width: `${playbackProgress}%` }}
            ></div>
          </div>
          
          <button 
            className="md:hidden text-xl hover:text-highlight transition-colors"
            onClick={handleOpenPlayer}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-gray-400 text-xs">{formatDuration(currentTime)}</span>
            <button 
              className="text-xl hover:text-highlight transition-colors"
              onClick={handleOpenPlayer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
