import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Album from "@/pages/album";
import Albums from "@/pages/albums";
import Player from "@/pages/player";
import Favorites from "@/pages/favorites";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Artists from "@/pages/artists";
import Songs from "@/pages/songs";
import NotFound from "@/pages/not-found";
import MiniPlayer from "@/components/mini-player";
import Sidebar from "@/components/sidebar";
import { PlayerProvider } from "@/context/player-context";
import { ThemeProvider } from "@/context/theme-context";
import { useEffect } from "react";
import { usePlayer } from "@/context/player-context";

function AppContent() {
  const { currentTrack } = usePlayer();

  // Set up title when track changes
  useEffect(() => {
    if (currentTrack) {
      document.title = `${currentTrack.title} - ${currentTrack.artist?.name || "Soundwave"}`;
    } else {
      document.title = "Soundwave Music Player";
    }
  }, [currentTrack]);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar h-full pb-20">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/album/:id" component={Album} />
            <Route path="/albums" component={Albums} />
            <Route path="/songs" component={Songs} />
            <Route path="/artists" component={Artists} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/player" component={Player} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      {currentTrack ? <MiniPlayer /> : null}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
