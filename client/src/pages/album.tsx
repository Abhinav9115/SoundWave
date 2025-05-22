import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import TrackCard from "@/components/track-card";
import AlbumCard from "@/components/album-card";
import { PlayerProvider, usePlayer, PlayerContextType } from "@/context/player-context";
// import { extractDominantColor } from "@/lib/color-extractor"; // Will use album.dominantColor from API
import { Album as AlbumType, Track } from "@/context/player-context"; // Assuming this type includes dominantColor
import { Button } from "@/components/ui/button"; // For styling play button

// Helper to lighten/darken hex colors for hover effects (basic version)
const shadeColor = (color: string, percent: number) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(String(R * (100 + percent) / 100));
  G = parseInt(String(G * (100 + percent) / 100));
  B = parseInt(String(B * (100 + percent) / 100));

  R = (R < 255) ? R : 255;  
  G = (G < 255) ? G : 255;  
  B = (B < 255) ? B : 255;  

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return `#${RR}${GG}${BB}`;
};


// Wrap the actual component in the provider
const AlbumContent = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/album/:id");
  const albumId = params?.id ? parseInt(params.id) : null;
  
  // Create a default context with empty functions that match the required type signatures
  let playerContext: PlayerContextType = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackProgress: 0,
    queue: [],
    playTrack: (_track: Track) => {},
    togglePlayPause: () => {},
    nextTrack: () => {},
    previousTrack: () => {},
    seekTo: (_time: number) => {},
    setVolume: (_volume: number) => {},
    addToQueue: (_track: Track) => {},
    clearQueue: () => {},
    shuffle: false,
    repeat: 'none',
    toggleShuffle: () => {},
    toggleRepeat: () => {}
  };
  
  try {
    playerContext = usePlayer();
  } catch (error) {
    console.error("Failed to access player context:", error);
  }
  
  const { playTrack, isPlaying, currentTrack, togglePlayPause } = playerContext;
  const [headerDominantColor, setHeaderDominantColor] = useState("rgba(157, 78, 221, 0.5)"); // For gradient
  const [buttonDominantColor, setButtonDominantColor] = useState("#9D4EDD"); // For button
  const [isAllAlbumsLoading, setIsAllAlbumsLoading] = useState(true);

  // Fetch album details
  // Assuming AlbumType from context or a new interface includes dominantColor
  const { data: album = {} as AlbumType & { tracks: Track[], artist: { name: string, id: number, imageUrl: string }, dominantColor?: string }, isLoading: isLoadingAlbum } = useQuery<AlbumType & { tracks: Track[], artist: { name: string, id: number, imageUrl: string }, dominantColor?: string }>({
    queryKey: [`/api/albums/${albumId}`],
    enabled: !!albumId,
    staleTime: 60000,
  });

  // Fetch all albums for recommendations
  const { data: allAlbums = [], isLoading: isLoadingAllAlbums } = useQuery({
    queryKey: ['/api/albums'],
    staleTime: 60000,
  });

  // Update loading state when allAlbums data is loaded
  useEffect(() => {
    if (allAlbums && Array.isArray(allAlbums) && allAlbums.length > 0) {
      setIsAllAlbumsLoading(false);
    }
  }, [allAlbums]);

  // Set dominant color from album data
  useEffect(() => {
    if (album?.dominantColor) {
      setHeaderDominantColor(`${album.dominantColor}80`); // Add 50% transparency for gradient
      setButtonDominantColor(album.dominantColor);
    } else if (album?.imageUrl) {
      // Fallback if dominantColor is not in API response, but was expected.
      // Or, if you want to always use client-side extraction for some reason.
      // For now, we primarily rely on album.dominantColor from API.
      // If client-side extraction is desired as a primary method:
      // extractDominantColor(album.imageUrl).then(color => {
      //   setHeaderDominantColor(`${color}80`);
      //   setButtonDominantColor(color);
      // }).catch(console.error);
      console.log("Album has imageUrl but no dominantColor field, using default.");
      setHeaderDominantColor("rgba(157, 78, 221, 0.5)"); // Default purple semi-transparent
      setButtonDominantColor("#9D4EDD"); // Default purple solid
    }
  }, [album]);

  // Handle play all tracks
  const handlePlayAll = () => {
    const albumData = album as any;
    if (!albumData?.tracks || !Array.isArray(albumData.tracks) || albumData.tracks.length === 0) return;

    // If currently playing from this album, toggle play/pause
    if (currentTrack?.albumId === albumData.id) {
      togglePlayPause();
    } else {
      // Start playing the first track
      playTrack(albumData.tracks[0]);
    }
  };

  const albumData = album as any;
  const isCurrentAlbumPlaying = isPlaying && currentTrack?.albumId === albumData?.id;

  // Get recommendations (other albums by same artist or random albums)
  const recommendations = Array.isArray(allAlbums) ? allAlbums.filter((otherAlbum: any) => {
    if (!albumData || !albumData.id) return false;
    if (otherAlbum.id === albumData.id) return false;
    
    // Prioritize albums by the same artist
    if (otherAlbum.artistId === albumData.artistId) return true;
    
    // Include some other albums to fill out recommendations
    return allAlbums.length < 8;
  }).slice(0, 4) : [];

  if (isLoadingAlbum) {
    return (
      <div className="p-5 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-64 h-64 bg-white/10 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-10 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
                <div className="h-8 bg-white/10 rounded w-32 mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            </div>
            <div className="mb-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="p-5 lg:p-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Album not found</h2>
          <p className="mb-6">The album you're looking for doesn't exist or has been removed.</p>
          <button 
            className="bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
            onClick={() => navigate('/')}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Album Header with Cover */}
        <motion.div 
          className="relative rounded-xl mb-8 glassmorphism overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `linear-gradient(to right, ${headerDominantColor}, rgba(36, 0, 70, 0.3))`,
          }}
        >
          <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 relative z-10">
            <motion.div 
              className="w-full md:w-64 h-64 shadow-xl rounded-xl overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={albumData.imageUrl} 
                alt={`${albumData.title || 'Album'} cover`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-white/20 text-sm px-2 py-0.5 rounded">Album</span>
                {albumData.releaseYear && (
                  <span className="text-sm text-white/60">{albumData.releaseYear}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-clash font-bold mb-2">{albumData.title || 'Unknown Album'}</h1>
              <p className="text-xl mb-4">{albumData.artist?.name || 'Unknown Artist'}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  onClick={handlePlayAll}
                  className="px-6 py-2 rounded-full font-medium flex items-center space-x-2 transition-all"
                  style={{ 
                    backgroundColor: isCurrentAlbumPlaying ? shadeColor(buttonDominantColor, -20) : buttonDominantColor, // Darken on playing
                    // Ensure text color has good contrast or set it dynamically
                    color: 'white', // Assuming white text works, may need dynamic contrast logic
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = shadeColor(buttonDominantColor, isCurrentAlbumPlaying ? -30 : -10)}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = isCurrentAlbumPlaying ? shadeColor(buttonDominantColor, -20) : buttonDominantColor}
                >
                  {isCurrentAlbumPlaying ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                      <span>Play</span>
                    </>
                  )}
                </Button>
                <motion.button 
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
                <motion.button 
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="md:mt-auto text-white/60 flex space-x-4 text-sm">
                <span>{albumData.tracks && Array.isArray(albumData.tracks) ? albumData.tracks.length : 0} Tracks</span>
                <span>•</span>
                <span>
                  {albumData.tracks && Array.isArray(albumData.tracks) ? 
                    albumData.tracks.reduce((total: number, track: any) => total + (track.duration || 0), 0) 
                    : 0} sec
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tracks list */}
        <motion.div 
          className="mb-12 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="font-clash font-bold text-2xl mb-4">Tracks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albumData.tracks && Array.isArray(albumData.tracks) ? albumData.tracks.map((track: any, index: number) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                animationDelay={index * 0.08}
              />
            )) : (
              <div className="col-span-2 text-center py-8 text-gray-400">
                No tracks available for this album
              </div>
            )}
          </div>
        </motion.div>

        {/* Recommended albums */}
        {!isAllAlbumsLoading && recommendations && recommendations.length > 0 && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="font-clash font-bold text-2xl mb-6">You might also like</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendations.map((albumItem: any) => (
                <AlbumCard key={albumItem.id} album={albumItem} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Album = () => {
  return (
    <PlayerProvider>
      <AlbumContent />
    </PlayerProvider>
  );
};

export default Album;
