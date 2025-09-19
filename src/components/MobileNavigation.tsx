import { motion } from 'motion/react';
import { 
  Home, 
  Coffee, 
  Focus, 
  BookOpen, 
  BarChart3, 
  Settings,
  LogOut,
  User
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user: User;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'break', label: 'Break Mode', icon: Coffee },
  { id: 'focus', label: 'Focus Mode', icon: Focus },
  { id: 'studyhub', label: 'Study Hub', icon: BookOpen },
  { id: 'summary', label: 'Summary', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

export function MobileNavigation({ currentPage, onPageChange, user, onLogout }: MobileNavigationProps) {
  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      onLogout();
    } else {
      onPageChange(itemId);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-card mx-4 mb-4 rounded-2xl border-0">
          <div className="flex items-center justify-around p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id && item.id !== 'logout';
              const isLogoutButton = item.id === 'logout';
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    relative p-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'gradient-primary text-white shadow-lg glow-primary' 
                      : isLogoutButton
                        ? 'text-error-solid hover:text-error-solid hover:bg-error-solid/10 hover:glow-error/30'
                        : 'text-foreground/60 hover:text-foreground hover:bg-white/10'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-6 h-6" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                      layoutId="mobileActiveIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Content Spacer */}
      <div className="h-24 md:hidden" /> {/* Bottom spacer */}
    </>
  );
}