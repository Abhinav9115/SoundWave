import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import TrackCard from "@/components/track-card";
import AlbumCard from "@/components/album-card";
import { usePlayer } from "@/context/player-context";
import { extractDominantColor } from "@/lib/color-extractor";
import { Album as AlbumType, Track } from "@/context/player-context";

const Album = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/album/:id");
  const albumId = params?.id ? parseInt(params.id) : null;
  const { playTrack, isPlaying, currentTrack, togglePlayPause } = usePlayer();
  const [dominantColor, setDominantColor] = useState("rgba(157, 78, 221, 0.5)");
  const [isAllAlbumsLoading, setIsAllAlbumsLoading] = useState(true);

  // Fetch album details
  const { data: album, isLoading: isLoadingAlbum } = useQuery({
    queryKey: [`/api/albums/${albumId}`],
    enabled: !!albumId,
    staleTime: 60000,
  });

  // Fetch all albums for recommendations
  const { data: allAlbums, isLoading: isLoadingAllAlbums } = useQuery({
    queryKey: ['/api/albums'],
    staleTime: 60000,
    onSuccess: () => setIsAllAlbumsLoading(false)
  });

  // Extract dominant color from album cover
  useEffect(() => {
    if (album?.imageUrl) {
      extractDominantColor(album.imageUrl)
        .then(color => {
          setDominantColor(`${color}80`); // Add 50% transparency
        })
        .catch(error => {
          console.error('Failed to extract color:', error);
        });
    }
  }, [album]);

  // Handle play all tracks
  const handlePlayAll = () => {
    if (!album?.tracks || album.tracks.length === 0) return;

    // If currently playing from this album, toggle play/pause
    if (currentTrack?.albumId === album.id) {
      togglePlayPause();
    } else {
      // Start playing the first track
      playTrack(album.tracks[0]);
    }
  };

  const isCurrentAlbumPlaying = isPlaying && currentTrack?.albumId === album?.id;

  // Get recommendations (other albums by same artist or random albums)
  const recommendations = allAlbums?.filter((otherAlbum: AlbumType) => {
    if (!album) return false;
    if (otherAlbum.id === album.id) return false;
    
    // Prioritize albums by the same artist
    if (otherAlbum.artistId === album.artistId) return true;
    
    // Include some other albums to fill out recommendations
    return allAlbums.length < 8;
  }).slice(0, 4);

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
            background: `linear-gradient(to right, ${dominantColor}, rgba(36, 0, 70, 0.3))`,
          }}
        >
          <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 relative z-10">
            <motion.div 
              className="w-full md:w-64 h-64 shadow-xl rounded-xl overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={album.imageUrl} 
                alt={`${album.title} album cover`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-white/20 text-sm px-2 py-0.5 rounded">Album</span>
                {album.releaseYear && (
                  <span className="text-sm text-white/60">{album.releaseYear}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-clash font-bold mb-2">{album.title}</h1>
              <p className="text-xl mb-4">{album.artist?.name}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <motion.button 
                  className={`${isCurrentAlbumPlaying ? 'bg-highlight text-secondary' : 'bg-primary'} px-6 py-2 rounded-full font-medium flex items-center space-x-2 hover:opacity-90 transition-all`}
                  onClick={handlePlayAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
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
                <span>{album.tracks?.length || 0} Tracks</span>
                <span>•</span>
                <span>
                  {album.tracks?.reduce((total: number, track: Track) => total + track.duration, 0) || 0} sec
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
            {album.tracks?.map((track: Track, index: number) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                animationDelay={index * 0.08}
              />
            ))}
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
              {recommendations.map((album: AlbumType) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Album;
