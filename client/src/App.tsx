import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Album from "@/pages/album";
import Player from "@/pages/player";
import MiniPlayer from "@/components/mini-player";
import Sidebar from "@/components/sidebar";
import CustomCursor from "@/components/custom-cursor";
import { Track } from "@/context/player-context";
import { useState, useEffect } from "react";

function App() {
  // We don't use usePlayer here anymore, we'll pass the needed props to children
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [title, setTitle] = useState("Soundwave Music Player");

  // Set up title when track changes
  useEffect(() => {
    if (currentTrack) {
      setTitle(`${currentTrack.title} - ${currentTrack.artist?.name || "Soundwave"}`);
    } else {
      setTitle("Soundwave Music Player");
    }
  }, [currentTrack]);

  // Update document title when title state changes
  useEffect(() => {
    document.title = title;
  }, [title]);

  // This function will be called by child components when a track is playing
  const updateCurrentTrack = (track: Track | null) => {
    setCurrentTrack(track);
  };

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
