import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Album from "@/pages/album";
import Player from "@/pages/player";
import MiniPlayer from "@/components/mini-player";
import Sidebar from "@/components/sidebar";
import CustomCursor from "@/components/custom-cursor";
import { usePlayer, Track } from "@/context/player-context";
import { useEffect } from "react";

function App() {
  // Safely access player context
  let currentTrack: Track | null = null;
  try {
    const playerContext = usePlayer();
    currentTrack = playerContext.currentTrack;
  } catch (error) {
    console.error("Failed to access player context:", error);
  }

  // Set up title
  useEffect(() => {
    if (currentTrack) {
      document.title = `${currentTrack.title} - ${currentTrack.artist?.name || "Soundwave"}`;
    } else {
      document.title = "Soundwave Music Player";
    }
  }, [currentTrack]);

  return (
    <>
      <CustomCursor />
      <div className="flex flex-col lg:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar h-full pb-20">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/album/:id" component={Album} />
            <Route path="/player" component={Player} />
          </Switch>
        </main>
      </div>
      {currentTrack ? <MiniPlayer /> : null}
      <Toaster />
    </>
  );
}

export default App;
