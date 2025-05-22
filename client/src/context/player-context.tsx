import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
 
export interface Artist {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface Album {
  id: number;
  title: string;
  artistId: number;
  imageUrl: string;
  releaseYear?: number;
  dominantColor?: string;
  artist?: Artist;
}

export interface Track {
  id: number;
  title: string;
  albumId: number;
  artistId: number;
  duration: number;
  trackNumber?: number;
  album?: Album;
  artist?: Artist;
}

interface Playlist {
  id: number;
  name: string;
  userId: number;
  imageUrl?: string;
  tracks?: Track[];
}

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackProgress: number;
  queue: Track[];
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<Track[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const { toast } = useToast();

  // Simulate playback progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 1;
          
          // If we reached the end of the track
          if (newTime >= duration) {
            if (repeat === 'one') {
              // Repeat the current track
              return 0;
            } else if (repeat === 'all' && queue.length > 0) {
              // Move to the next track or back to the beginning
              nextTrack();
              return 0;
            } else if (queue.length > 0) {
              // Move to next track
              nextTrack();
              return 0;
            } else {
              // Stop playback
              setIsPlaying(false);
              return 0;
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack, duration, repeat, queue.length]);

  // Set duration when track changes
  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.duration);
      setCurrentTime(0);
      
      // Log recently played
      if (currentTrack.id) {
        apiRequest('POST', '/api/recently-played', { trackId: currentTrack.id })
          .catch(err => console.error('Failed to log recently played:', err));
      }
    }
  }, [currentTrack]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist?.name || 'Unknown Artist'}`,
    });
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    
    // Get the next track from the queue and remove it
    const nextTrack = queue[0];
    setQueue(queue.slice(1));
    
    // Play the next track
    playTrack(nextTrack);
  };

  const previousTrack = () => {
    // For demo purposes, just restart the current track
    setCurrentTime(0);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  const addToQueue = (track: Track) => {
    setQueue([...queue, track]);
    toast({
      title: "Added to Queue",
      description: `${track.title} has been added to your queue.`,
    });
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    toast({
      title: shuffle ? "Shuffle Off" : "Shuffle On",
      description: shuffle ? "Playback order is now sequential." : "Your queue will play in random order.",
    });
  };

  const toggleRepeat = () => {
    const newRepeat = repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none';
    setRepeat(newRepeat);
    
    const messages = {
      'none': "Repeat is turned off.",
      'all': "Repeating all tracks in queue.",
      'one': "Repeating current track."
    };
    
    toast({
      title: `Repeat ${newRepeat !== 'none' ? 'On' : 'Off'}`,
      description: messages[newRepeat],
    });
  };

  // Calculate playback progress as a percentage
  const playbackProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackProgress,
        queue,
        playTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        seekTo,
        setVolume,
        addToQueue,
        clearQueue,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
