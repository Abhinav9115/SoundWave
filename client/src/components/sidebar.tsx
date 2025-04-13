import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { playlists } from "@/lib/mockdata";

const Sidebar = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch playlists
  const { data: playlistsData } = useQuery({
    queryKey: ['/api/playlists'],
    staleTime: 60000,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <aside className="glassmorphism w-full lg:w-64 flex-shrink-0 lg:h-screen overflow-y-auto custom-scrollbar z-10">
      <div className="p-5">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <h1 className="font-clash font-bold text-3xl text-highlight tracking-wide cursor-pointer">
              Soundwave
            </h1>
          </Link>
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
        
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="space-y-1">
            <h2 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">Menu</h2>
            <div 
              onClick={() => window.location.href = '/'} 
              className={`flex items-center py-2 px-3 rounded-lg mb-1 cursor-pointer ${location === '/' ? 'bg-primary bg-opacity-20 border-l-4 border-highlight' : 'hover:bg-white hover:bg-opacity-10 transition-all'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </div>
            <div className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </div>
            <div className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Favorites</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-1">
            <h2 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">Your Library</h2>
            <div className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Albums</span>
            </div>
            <div className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>Songs</span>
            </div>
            <div className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Artists</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-1">
            <h2 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">Playlists</h2>
            {(playlistsData || []).map((playlist: any) => (
              <div key={playlist.id} className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
                {playlist.imageUrl ? (
                  <div className="w-6 h-6 rounded mr-3 flex-shrink-0 overflow-hidden">
                    <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-6 h-6 bg-gradient-to-br ${playlists.find(p => p.id === playlist.id)?.imageColor || 'from-purple-500 to-pink-500'} rounded mr-3 flex-shrink-0`}></div>
                )}
                <span className="truncate">{playlist.name}</span>
              </div>
            ))}
            
            {/* Placeholder playlists if API data not loaded */}
            {!playlistsData && playlists.map(playlist => (
              <div key={playlist.id} className="flex items-center py-2 px-3 rounded-lg mb-1 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer">
                <div className={`w-6 h-6 bg-gradient-to-br ${playlist.imageColor} rounded mr-3 flex-shrink-0`}></div>
                <span className="truncate">{playlist.name}</span>
              </div>
            ))}
            
            <button className="mt-3 text-highlight flex items-center hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Create Playlist</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
