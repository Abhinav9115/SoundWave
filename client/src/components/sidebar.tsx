import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { playlists } from "@/lib/mockdata";
import { usePlayer } from "@/context/player-context";
import { useToast } from "@/hooks/use-toast";
 
// Create interfaces for search and favorites
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-clash">Search</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-highlight"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {searchTerm ? (
            <div className="py-3 text-center text-gray-400">
              Type to search for music
            </div>
          ) : (
            <div className="py-3 text-center text-gray-400">
              Begin typing to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-gray-900 shadow-xl z-50 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="py-8 text-center text-gray-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-sm">No new notifications</p>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // We'll use a safer approach to get the player context
  // First declare default values
  const [volume, setVolume] = useState(0.7);
  
  // Try to use the player context, but catch errors
  try {
    const playerContext = usePlayer();
    // If we successfully got the context, update our local state
    useEffect(() => {
      if (playerContext && playerContext.volume !== undefined) {
        setVolume(playerContext.volume);
      }
    }, [playerContext?.volume]);
  } catch (error) {
    // Just ignore the error - we'll use our default values
    console.log("Using default volume settings");
  }
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    try {
      const playerContext = usePlayer();
      if (playerContext && playerContext.setVolume) {
        playerContext.setVolume(newVolume);
      }
    } catch (error) {
      // Just ignore the error
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-gray-900 shadow-xl z-50 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Audio Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Volume</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-highlight"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Appearance</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="dark-mode" className="mr-2 accent-highlight" defaultChecked />
              <label htmlFor="dark-mode" className="text-sm">Dark Mode</label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">About</h3>
          <div className="text-sm text-gray-400">
            <p>Soundwave Music Player</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch playlists
  const { data: playlistsData } = useQuery({
    queryKey: ['/api/playlists'],
    staleTime: 60000,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const showFavorites = () => {
    navigate('/favorites');
  };

  const showAlbums = () => {
    navigate('/albums');
  };

  const showSongs = () => {
    navigate('/songs');
  };

  const showArtists = () => {
    navigate('/artists');
  };

  const showProfile = () => {
    navigate('/profile');
  };

  const showSettings = () => {
    navigate('/settings');
  };

  const createPlaylist = () => {
    toast({
      title: "Create Playlist",
      description: "Playlist creation will be available soon!",
    });
  };

  return (
    <>
      <aside className="glassmorphism w-full lg:w-64 flex-shrink-0 lg:h-screen overflow-y-auto custom-scrollbar z-10">
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <h1 className="font-clash font-bold text-3xl text-highlight tracking-wide cursor-pointer">
                Soundwave
              </h1>
            </Link>
            <div className="flex items-center space-x-3">
              <div 
                className="hover:bg-white hover:bg-opacity-10 p-2 rounded-full transition-all cursor-pointer"
                onClick={() => setNotificationsOpen(true)}
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div 
                className="lg:hidden hover:bg-white hover:bg-opacity-10 p-2 rounded-full transition-all cursor-pointer"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          <div className={`lg:block ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div 
              className="hover:bg-white hover:bg-opacity-10 p-2 rounded-xl transition-all cursor-pointer flex items-center mb-4"
              onClick={toggleSearch}
            >
              <div className="mr-4 bg-white bg-opacity-10 w-10 h-10 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span>Search</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-white text-opacity-60 mb-2 ml-2">Navigation</p>
              
              {/* Home */}
              <Link href="/">
                <div className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}>
                  <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span>Home</span>
                </div>
              </Link>
              
              {/* Songs */}
              <div 
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/songs' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}
                onClick={showSongs}
              >
                <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span>Songs</span>
              </div>
              
              {/* Albums */}
              <div 
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/albums' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}
                onClick={showAlbums}
              >
                <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-2 0h-6m2 0h6" />
                  </svg>
                </div>
                <span>Albums</span>
              </div>
              
              {/* Artists */}
              <div 
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/artists' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}
                onClick={showArtists}
              >
                <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>Artists</span>
              </div>
              
              {/* Favorites */}
              <div 
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/favorites' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}
                onClick={showFavorites}
              >
                <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span>Favorites</span>
              </div>
            </div>
            
            {/* User-related */}
            <div className="mt-6 space-y-1">
              <p className="text-sm text-white text-opacity-60 mb-2 ml-2">Your Account</p>
              
              {/* Profile */}
              <div 
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/profile' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}
                onClick={showProfile}
              >
                <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Profile</span>
              </div>
              
              {/* Settings */}
              <div 
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${location === '/settings' ? 'bg-highlight text-black' : 'hover:bg-white hover:bg-opacity-10'}`}
                onClick={showSettings}
              >
                <div className="mr-4 w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Settings</span>
              </div>
            </div>
            
            {/* ... rest of the sidebar content ... */}
          </div>
        </div>
      </aside>
      
      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
