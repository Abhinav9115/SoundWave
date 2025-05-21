import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Album from "@/pages/album";
import Albums from "@/pages/albums";
import Player from "@/pages/player";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import NotFound from "@/pages/not-found";
import MiniPlayer from "@/components/mini-player";
import Sidebar from "@/components/sidebar";
import CustomCursor from "@/components/custom-cursor";
import { Track } from "@/context/player-context"; 
import { AuthProvider, useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route"; // Added
import { useState, useEffect } from "react";

// A wrapper component to handle conditional rendering based on auth state
function AppContent() {
  // We don't use usePlayer here anymore, we'll pass the needed props to children
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null); // This state might be better in PlayerContext
  const [title, setTitle] = useState("Soundwave Music Player");
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();


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
  // const updateCurrentTrack = (track: Track | null) => {
  //   setCurrentTrack(track);
  // };

  if (isAuthLoading) {
    // You can render a global loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <CustomCursor />
      <div className="flex flex-col lg:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar h-full pb-20">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/album/:id" component={Album} />
            <Route path="/albums" component={Albums} />
            <ProtectedRoute path="/player" component={Player} /> 
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      {/* MiniPlayer might also need context for currentTrack */}
      {currentTrack ? <MiniPlayer /> : null} 
      <Toaster />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
