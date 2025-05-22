import { Artist } from "@/context/player-context";
// import { motion } from "framer-motion"; // Can be removed if not used for complex animations

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  // Basic click handler, can be expanded (e.g., navigate to artist page)
  const handleClick = () => {
    console.log(`Navigating to artist: ${artist.name}`);
    // navigate(`/artist/${artist.id}`); // Example navigation
  };

  return (
    <div // Changed from motion.div
      className="group flex flex-col items-center space-y-3 flex-shrink-0 cursor-pointer p-3 bg-card/50 hover:bg-card/70 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.03] focus-within:scale-[1.03] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
      onClick={handleClick}
      tabIndex={0} // Make it focusable
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="relative w-24 h-24 overflow-hidden rounded-full shadow-lg group-hover:shadow-xl group-focus-within:shadow-xl transition-shadow duration-300">
        <img 
          src={artist.imageUrl} 
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-focus-within:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
          <button // Changed from motion.button
            className="bg-highlight hover:bg-highlight/90 text-secondary rounded-full px-3 py-1 text-xs font-medium transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-white/50"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking button
              console.log(`Follow artist: ${artist.name}`);
            }}
            aria-label={`Follow ${artist.name}`}
          >
            Follow
          </button>
        </div>
      </div>
      <h3 className="font-medium text-center truncate group-hover:text-primary transition-colors duration-300">{artist.name}</h3>
    </div>
  );
};

export default ArtistCard;
