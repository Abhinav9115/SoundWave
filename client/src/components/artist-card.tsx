import { Artist } from "@/context/player-context";
import { motion } from "framer-motion";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center space-y-3 flex-shrink-0"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-24 h-24 overflow-hidden rounded-full group">
        <img 
          src={artist.imageUrl} 
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
          <motion.button 
            className="bg-highlight text-secondary rounded-full px-3 py-1 text-xs font-medium"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Follow
          </motion.button>
        </div>
      </div>
      <h3 className="font-medium text-center">{artist.name}</h3>
    </motion.div>
  );
};

export default ArtistCard;
