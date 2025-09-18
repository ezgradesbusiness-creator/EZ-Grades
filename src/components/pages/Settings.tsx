import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings as SettingsIcon, 
  Palette, 
  Volume2, 
  Bell,
  Shield,
  Download,
  Trash2,
  Moon,
  Sun,
  Type,
  Globe,
  Clock
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { LuxuryButton } from '../LuxuryButton';
import { LuxuryBadge } from '../LuxuryBadge';
import { ThemeToggle } from '../ThemeToggle';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  totalStudyTime: number;
  coursesCompleted: number;
  currentStreak: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface SettingsProps {
  user?: User;
  onLogout?: () => void;
}

export function Settings({ user, onLogout }: SettingsProps) {
  const [activeSection, setActiveSection] = useState('account');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@email.com',
    avatar: '👨‍💻',
    joinedDate: '2023-08-15',
    totalStudyTime: 156.5,
    coursesCompleted: 8,
    currentStreak: 12
  });

  const [settings, setSettings] = useState({
    notifications: {
      studyReminders: true,
      breakReminders: true,
      achievementAlerts: true,
      weeklyReports: false
    },
    audio: {
      masterVolume: 70,
      ambientSounds: 50,
      notificationSounds: 80,
      keyboardSounds: 30
    },
    display: {
      fontSize: 'medium',
      language: 'english',
      timeFormat: '24h',
      theme: 'auto'
    },
    privacy: {
      profileVisibility: 'friends',
      studyDataSharing: false,
      analyticsOptIn: true
    }
  });

  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download }
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen pb-8 px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-primary">Settings</span> ⚙️
          </h1>
          <p className="text-lg text-muted-foreground">Customize your learning experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Menu */}
          <div className="lg:col-span-1">
            <GlassCard>
              <h2 className="font-semibold mb-4 text-gradient-primary">Settings Menu</h2>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                        ${activeSection === item.id
                          ? 'gradient-primary text-white shadow-lg'
                          : 'hover:bg-white/10 hover:glow-primary text-foreground/80 hover:text-foreground'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <GlassCard size="lg">
              {/* Account Settings */}
              {activeSection === 'account' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gradient-primary">Account Settings</h2>
                  
                  {/* Profile Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl">
                        {userProfile.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                              type="text"
                              value={userProfile.name}
                              onChange={(e) => handleProfileUpdate('name', e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-input-background border border-border/50 focus:border-primary-solid focus:outline-none focus:ring-2 focus:ring-primary-solid/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              value={userProfile.email}
                              onChange={(e) => handleProfileUpdate('email', e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-input-background border border-border/50 focus:border-primary-solid focus:outline-none focus:ring-2 focus:ring-primary-solid/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-muted/20">
                      <div className="text-2xl font-bold text-primary-solid mb-1">
                        {userProfile.totalStudyTime}h
                      </div>
                      <div className="text-sm text-muted-foreground">Total Study Time</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/20">
                      <div className="text-2xl font-bold text-secondary-solid mb-1">
                        {userProfile.coursesCompleted}
                      </div>
                      <div className="text-sm text-muted-foreground">Courses Completed</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/20">
                      <div className="text-2xl font-bold text-highlight-solid mb-1">
                        {userProfile.currentStreak}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Streak</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <LuxuryButton variant="primary">
                      Save Changes
                    </LuxuryButton>
                    <LuxuryButton variant="outline">
                      Change Password
                    </LuxuryButton>
                  </div>
                </motion.div>
              )}

              {/* Display Settings */}
              {activeSection === 'display' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gradient-primary">Display Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Theme
                      </h3>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                        <div>
                          <div className="font-medium">Dark/Light Mode</div>
                          <div className="text-sm text-muted-foreground">Toggle between light and dark themes</div>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        Font Size
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {['small', 'medium', 'large'].map((size) => (
                          <motion.button
                            key={size}
                            onClick={() => updateSetting('display', 'fontSize', size)}
                            className={`
                              p-4 rounded-lg border-2 transition-all duration-300 capitalize
                              ${settings.display.fontSize === size
                                ? 'gradient-primary text-white border-transparent'
                                : 'bg-muted/20 border-muted hover:border-primary-solid/50'
                              }
                            `}
                            whileTap={{ scale: 0.98 }}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Language
                      </h3>
                      <select
                        value={settings.display.language}
                        onChange={(e) => updateSetting('display', 'language', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border/50 focus:border-primary-solid focus:outline-none"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Español</option>
                        <option value="french">Français</option>
                        <option value="german">Deutsch</option>
                        <option value="japanese">日本語</option>
                      </select>
                    </div>

                    {/* Time Format */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Time Format
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: '12h', label: '12 Hour (AM/PM)' },
                          { value: '24h', label: '24 Hour' }
                        ].map((format) => (
                          <motion.button
                            key={format.value}
                            onClick={() => updateSetting('display', 'timeFormat', format.value)}
                            className={`
                              p-4 rounded-lg border-2 transition-all duration-300
                              ${settings.display.timeFormat === format.value
                                ? 'gradient-primary text-white border-transparent'
                                : 'bg-muted/20 border-muted hover:border-primary-solid/50'
                              }
                            `}
                            whileTap={{ scale: 0.98 }}
                          >
                            {format.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Audio Settings */}
              {activeSection === 'audio' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gradient-primary">Audio Settings</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(settings.audio).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <span className="text-sm text-muted-foreground">{value}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => updateSetting('audio', key, Number(e.target.value))}
                          className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <LuxuryButton variant="secondary">
                      Test Audio Settings
                    </LuxuryButton>
                  </div>
                </motion.div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gradient-primary">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                        <div>
                          <div className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {key === 'studyReminders' && 'Get reminded to start your study sessions'}
                            {key === 'breakReminders' && 'Notifications to take regular breaks'}
                            {key === 'achievementAlerts' && 'Celebrate when you unlock achievements'}
                            {key === 'weeklyReports' && 'Receive weekly progress summaries'}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => updateSetting('notifications', key, !value)}
                          className={`
                            relative w-12 h-6 rounded-full transition-all duration-300
                            ${value ? 'gradient-primary' : 'bg-muted'}
                          `}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                            animate={{ x: value ? 26 : 2 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Privacy Settings */}
              {activeSection === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gradient-primary">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Profile Visibility</h3>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border/50 focus:border-primary-solid focus:outline-none"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div>
                        <div className="font-medium">Study Data Sharing</div>
                        <div className="text-sm text-muted-foreground">
                          Allow anonymous study data to improve the platform
                        </div>
                      </div>
                      <motion.button
                        onClick={() => updateSetting('privacy', 'studyDataSharing', !settings.privacy.studyDataSharing)}
                        className={`
                          relative w-12 h-6 rounded-full transition-all duration-300
                          ${settings.privacy.studyDataSharing ? 'gradient-primary' : 'bg-muted'}
                        `}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                          animate={{ x: settings.privacy.studyDataSharing ? 26 : 2 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div>
                        <div className="font-medium">Analytics Opt-in</div>
                        <div className="text-sm text-muted-foreground">
                          Help us improve by sharing usage analytics
                        </div>
                      </div>
                      <motion.button
                        onClick={() => updateSetting('privacy', 'analyticsOptIn', !settings.privacy.analyticsOptIn)}
                        className={`
                          relative w-12 h-6 rounded-full transition-all duration-300
                          ${settings.privacy.analyticsOptIn ? 'gradient-primary' : 'bg-muted'}
                        `}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                          animate={{ x: settings.privacy.analyticsOptIn ? 26 : 2 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Data Management */}
              {activeSection === 'data' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gradient-primary">Data Management</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-lg border border-secondary-solid/30 bg-secondary-solid/5">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Download className="w-5 h-5 text-secondary-solid" />
                        Export Data
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download a copy of all your study data, progress, and achievements.
                      </p>
                      <LuxuryButton variant="secondary" size="sm">
                        Download Data
                      </LuxuryButton>
                    </div>

                    <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/5">
                      <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <LuxuryButton variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
                        Delete Account
                      </LuxuryButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}