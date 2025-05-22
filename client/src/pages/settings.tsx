import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  
  // Profile form state
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    username: "musiclover",
    email: "alex@example.com",
    bio: "Music enthusiast with a passion for indie and electronic. Always on the lookout for new sounds and artists."
  });
  
  // App preferences state
  const [preferences, setPreferences] = useState({
    autoplay: true,
    highQualityStreaming: true,
    notificationsEnabled: true,
    downloadQuality: "high",
    language: "english"
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    shareListeningActivity: true,
    showRecentlyPlayed: true,
    allowRecommendations: true
  });
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle preference changes
  const handlePreferenceChange = (key: string, value: boolean | string) => {
    if (key === 'theme') {
      setTheme(value as 'vibrant' | 'ocean' | 'sunset');
    } else {
      setPreferences({
        ...preferences,
        [key]: value
      });
    }
  };
  
  // Handle privacy setting changes
  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save the data to an API
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
  };
  
  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-clash font-bold">Settings</h1>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Back to Profile
            </Button>
          </div>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            {/* Account Settings */}
            <TabsContent value="account">
              <Card className="bg-secondary/10 border-primary/10">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-background/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="bg-background/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-background/30"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="bg-background/30 min-h-[100px]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/10 border-primary/10 mt-6">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="bg-background/30"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="bg-background/30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="bg-background/30"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences */}
            <TabsContent value="preferences">
              <Card className="bg-secondary/10 border-primary/10">
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Color Scheme</h3>
                        <p className="text-sm text-muted-foreground">Switch between dark and light mode</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                      >
                        {colorScheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Theme</h3>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={theme === 'vibrant' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('vibrant')}
                        >
                          Vibrant
                        </Button>
                        <Button
                          variant={theme === 'ocean' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('ocean')}
                        >
                          Ocean
                        </Button>
                        <Button
                          variant={theme === 'sunset' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('sunset')}
                        >
                          Sunset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Autoplay</h3>
                        <p className="text-sm text-white/60">Automatically play music when you open the app</p>
                      </div>
                      <Switch
                        checked={preferences.autoplay}
                        onCheckedChange={(checked) => handlePreferenceChange('autoplay', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">High Quality Streaming</h3>
                        <p className="text-sm text-white/60">Stream music in highest quality (uses more data)</p>
                      </div>
                      <Switch
                        checked={preferences.highQualityStreaming}
                        onCheckedChange={(checked) => handlePreferenceChange('highQualityStreaming', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notifications</h3>
                        <p className="text-sm text-white/60">Enable notifications for new releases and events</p>
                      </div>
                      <Switch
                        checked={preferences.notificationsEnabled}
                        onCheckedChange={(checked) => handlePreferenceChange('notificationsEnabled', checked)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="download-quality">Download Quality</Label>
                        <Select 
                          value={preferences.downloadQuality}
                          onValueChange={(value) => handlePreferenceChange('downloadQuality', value)}
                        >
                          <SelectTrigger id="download-quality" className="bg-background/30">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (64kbps)</SelectItem>
                            <SelectItem value="medium">Medium (128kbps)</SelectItem>
                            <SelectItem value="high">High (320kbps)</SelectItem>
                            <SelectItem value="lossless">Lossless</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={preferences.language}
                          onValueChange={(value) => handlePreferenceChange('language', value)}
                        >
                          <SelectTrigger id="language" className="bg-background/30">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleSubmit}>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Privacy */}
            <TabsContent value="privacy">
              <Card className="bg-secondary/10 border-primary/10">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Share Listening Activity</h3>
                        <p className="text-sm text-white/60">Allow friends to see what you're listening to</p>
                      </div>
                      <Switch
                        checked={privacySettings.shareListeningActivity}
                        onCheckedChange={(checked) => handlePrivacyChange('shareListeningActivity', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show Recently Played</h3>
                        <p className="text-sm text-white/60">Display your recently played tracks on your profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.showRecentlyPlayed}
                        onCheckedChange={(checked) => handlePrivacyChange('showRecentlyPlayed', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Allow Personalized Recommendations</h3>
                        <p className="text-sm text-white/60">Use your listening history for better recommendations</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowRecommendations}
                        onCheckedChange={(checked) => handlePrivacyChange('allowRecommendations', checked)}
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-primary/10">
                      <h3 className="font-medium text-red-400 mb-2">Danger Zone</h3>
                      <div className="space-y-4">
                        <Button variant="destructive" className="w-full sm:w-auto">
                          Delete All Listening History
                        </Button>
                        <Button variant="destructive" className="w-full sm:w-auto">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleSubmit}>Save Privacy Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 