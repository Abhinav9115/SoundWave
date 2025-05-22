import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlayerProvider } from "./context/player-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Root component to avoid circular dependency issues
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
 