import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface VisualizerProps {
  isPlaying: boolean;
}
 
const Visualizer = ({ isPlaying }: VisualizerProps) => {
  const barsRef = useRef<HTMLDivElement>(null);

  // Randomize visualizer bars animation
  useEffect(() => {
    if (barsRef.current) {
      const bars = barsRef.current.querySelectorAll('.visualizer-bar');
      
      bars.forEach((bar) => {
        if (bar instanceof HTMLElement) {
          // Randomize height
          const height = 30 + Math.random() * 60;
          bar.style.height = `${height}%`;
          
          // Randomize animation delay
          const delay = Math.random();
          bar.style.animationDelay = `${delay}s`;
          
          // Randomize animation duration
          const duration = 0.6 + Math.random() * 0.8;
          bar.style.animationDuration = `${duration}s`;
        }
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Audio visualizer circles */}
      <motion.div 
        className="absolute w-96 h-96 border border-primary rounded-full"
        animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-80 h-80 border border-highlight rounded-full"
        animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div 
        className="absolute w-64 h-64 border border-accent rounded-full"
        animate={{ scale: isPlaying ? [1, 1.15, 1] : 1 }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Visualizer bars */}
      <div 
        ref={barsRef}
        className="flex items-end space-x-1 md:space-x-2 h-full absolute inset-x-0 justify-center bottom-0 top-auto"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className={`w-1 md:w-1.5 bg-highlight opacity-30 visualizer-bar rounded-t ${!isPlaying ? 'animation-pause' : ''}`}
            style={{ 
              height: '50%',
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Visualizer;
