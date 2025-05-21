import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
// import { playlists } from "@/lib/mockdata"; // Mock data might not be needed if API is used
import { usePlayer } from "@/context/player-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context"; // Added
import { Button } from "@/components/ui/button"; // Added for login/logout buttons

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
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth(); // Use auth context

  // Fetch playlists - this will now use the Authorization header if a token is present
  const { data: playlistsData, refetch: refetchPlaylists } = useQuery<any[]>({ // Specify type for playlistsData
    queryKey: ['/api/playlists'],
    staleTime: 60000,
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  useEffect(() => {
    if (isAuthenticated) {
      refetchPlaylists();
    }
  }, [isAuthenticated, refetchPlaylists]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate('/'); // Redirect to home or login page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const showFavorites = () => {
    toast({
      title: "Favorites",
      description: "Your favorites feature will be available soon!",
    });
  };

  const showAlbums = () => {
    navigate('/albums');
    toast({
      title: "Albums",
      description: "Browsing all albums",
    });
  };

  const showSongs = () => {
    toast({
      title: "Songs",
      description: "Your songs library will be available soon!",
    });
  };

  const showArtists = () => {
    toast({
      title: "Artists",
      description: "Browsing artists will be available soon!",
    });
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
              {isAuthenticated && user && (
                <div className="text-sm text-right hidden lg:block">
                  <p className="font-semibold">{user.username}</p>
                  {/* <p className="text-xs text-gray-400">View Profile</p> */}
                </div>
              )}
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
                className="hover:bg-white hover:bg-opacity-10 p-2 rounded-full transition-all cursor-pointer"
                onClick={() => setSettingsOpen(true)}
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="lg:hidden">
                <button className="focus:outline-none text-white" onClick={toggleMenu}>
                  <i className="bx bx-menu text-2xl">
                    {isMenuOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </i>
                </button>
              </div>
            </div>
          </div>
          
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="space-y-1">
              <h2 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">Menu</h2>
              <Link href="/">
                <div className={`flex items-center py-2 px-3 rounded-lg mb-1 cursor-pointer ${location === '/' ? 'bg-primary bg-opacity-20 border-l-4 border-highlight' : 'hover:bg-white hover:bg-opacity-10 transition-all'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </div>
              </Link>
              <div 
                onClick={toggleSearch}
                className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </div>
              <div 
                onClick={showFavorites}
                className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Favorites</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-1">
              <h2 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">Your Library</h2>
              <div 
                onClick={showAlbums}
                className={`flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer ${location === '/albums' ? 'bg-primary bg-opacity-20 border-l-4 border-highlight' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Albums</span>
              </div>
              <div 
                onClick={showSongs}
                className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span>Songs</span>
              </div>
              <div 
                onClick={showArtists}
                className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Artists</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-1">
              <h2 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">Playlists</h2>
              {isAuthenticated && playlistsData && playlistsData.map((playlist: any) => (
                <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                  <div className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
                    {playlist.imageUrl ? (
                      <div className="w-6 h-6 rounded mr-3 flex-shrink-0 overflow-hidden">
                        <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      // Fallback style if no imageColor is provided by mockdata or API
                      <div className={`w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded mr-3 flex-shrink-0`}></div>
                    )}
                    <span className="truncate">{playlist.name}</span>
                  </div>
                </Link>
              ))}
              
              {isAuthenticated && (
                <button 
                  onClick={createPlaylist} // This still uses a toast, actual creation needs a modal/form
                  className="mt-3 text-highlight flex items-center hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Create Playlist</span>
                </button>
              )}
            </div>

            {/* Auth buttons */}
            <div className="mt-auto pt-6 border-t border-gray-700 space-y-2">
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-left">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="ghost" className="w-full justify-start text-left">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </aside>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Notifications Panel */}
      <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      
      {/* Settings Panel */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
