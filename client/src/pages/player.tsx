import { usePlayer } from "@/context/player-context";
import { useLocation } from "wouter";
import { useEffect } from "react";
import FullPlayer from "@/components/full-player";
import { motion } from "framer-motion";

const Player = () => {
  const { currentTrack } = usePlayer();
  const [, navigate] = useLocation();

  // If no track is playing, redirect to home
  useEffect(() => {
    if (!currentTrack) {
      navigate('/');
    }
  }, [currentTrack, navigate]);

  const handleClose = () => {
    navigate('/');
  };
 
  if (!currentTrack) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-screen p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">No Track Playing</h2>
        <p className="mb-6 text-white/60">Select a track to start listening.</p>
        <button 
          className="bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
          onClick={() => navigate('/')}
        >
          Browse Music
        </button>
      </motion.div>
    );
  }

  return <FullPlayer onClose={handleClose} />;
};

export default Player;
