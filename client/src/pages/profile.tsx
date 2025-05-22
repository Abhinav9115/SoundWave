import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

// Demo user data - in a real app this would come from an API
const initialUserData = {
  id: 1,
  username: "musiclover",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatarUrl: "https://ui-avatars.com/api/?name=Alex+Johnson&background=random",
  bio: "Music enthusiast with a passion for indie and electronic. Always on the lookout for new sounds and artists.",
  joinDate: "2023-05-15",
  stats: {
    songsPlayed: 1254,
    favoriteTracks: 87,
    favoriteAlbums: 32,
    totalListeningTime: "476h 23m",
  }
};

interface RecentActivity {
  id: number;
  type: "played" | "liked" | "playlist";
  title: string;
  subtitle: string;
  imageUrl: string;
  timestamp: string;
}

// Demo recent activity - in a real app this would come from an API
const demoRecentActivity: RecentActivity[] = [
  {
    id: 1,
    type: "played",
    title: "Bohemian Rhapsody",
    subtitle: "Queen - A Night at the Opera",
    imageUrl: "https://via.placeholder.com/80",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    type: "liked",
    title: "Starlight",
    subtitle: "Muse - Black Holes and Revelations",
    imageUrl: "https://via.placeholder.com/80",
    timestamp: "Yesterday"
  },
  {
    id: 3,
    type: "playlist",
    title: "Added 3 songs to Workout Mix",
    subtitle: "Personal Playlist",
    imageUrl: "https://via.placeholder.com/80",
    timestamp: "2 days ago"
  },
  {
    id: 4,
    type: "played",
    title: "Hey Jude",
    subtitle: "The Beatles - Past Masters",
    imageUrl: "https://via.placeholder.com/80",
    timestamp: "3 days ago"
  }
];

const ActivityIcon = ({ type }: { type: RecentActivity["type"] }) => {
  switch (type) {
    case "played":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
      );
    case "liked":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "playlist":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    default:
      return null;
  }
};

const Profile = () => {
  const [, navigate] = useLocation();
  
  // In a real app, we would fetch user data from an API
  // Simulating loading state
  const { data: userData = initialUserData, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    initialData: initialUserData,
    staleTime: 60000,
  });

  // Simulating activity data loading
  const { data: recentActivity = demoRecentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['/api/user/activity'],
    initialData: demoRecentActivity,
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="p-5 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-1/4 mb-6"></div>
                <div className="h-20 bg-white/10 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          {/* Profile Header */}
          <div className="glassmorphism rounded-xl p-6 md:p-8 mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg"
            >
              <img
                src={userData.avatarUrl}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-clash font-bold mb-1">{userData.name}</h1>
              <p className="text-lg text-white/60 mb-4">@{userData.username}</p>
              <p className="mb-4 max-w-2xl">{userData.bio}</p>
              <p className="text-sm text-white/50">Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="px-4"
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-secondary/20 border-primary/10">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Songs Played</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-highlight">{userData.stats.songsPlayed}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/20 border-primary/10">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Favorite Tracks</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-highlight">{userData.stats.favoriteTracks}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/20 border-primary/10">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Favorite Albums</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-highlight">{userData.stats.favoriteAlbums}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/20 border-primary/10">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">Listening Time</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold text-highlight">{userData.stats.totalListeningTime}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            
            {isLoadingActivity ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/10 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    className="glassmorphism rounded-xl p-3 flex items-center gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <ActivityIcon type={activity.type} />
                    </div>
                    
                    <img
                      src={activity.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded object-cover hidden sm:block"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{activity.title}</h3>
                      <p className="text-sm text-white/60 truncate">{activity.subtitle}</p>
                    </div>
                    
                    <div className="text-sm text-white/50 whitespace-nowrap">
                      {activity.timestamp}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 