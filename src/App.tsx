import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { MobileNavigation } from './components/MobileNavigation';
import { MobileTopNavigation } from './components/MobileTopNavigation';
import { Dashboard } from './components/pages/Dashboard';
import { BreakMode } from './components/pages/BreakMode';
import { FocusMode } from './components/pages/FocusMode';
import { StudyHub } from './components/pages/StudyHub';
import { Summary } from './components/pages/Summary';
import { Settings } from './components/pages/Settings';
import { Login } from './components/pages/Login';
import { SignUp } from './components/pages/SignUp';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { useIsMobile } from './components/ui/use-mobile';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Start with login instead of dashboard
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Protected routes that require authentication
  const protectedRoutes = ['dashboard', 'break', 'focus', 'studyhub', 'summary', 'settings'];

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('ezgrades_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Migration: Add username field if it doesn't exist
          if (!parsedUser.username) {
            parsedUser.username = 'Scholar';
          }
          setUser(parsedUser);
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem('ezgrades_user');
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  // Save user session to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('ezgrades_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ezgrades_user');
    }
  }, [user]);

  // Check if user is trying to access a protected route without authentication
  const isProtectedRoute = (route: string) => protectedRoutes.includes(route);

  // Redirect to login if trying to access protected route without authentication
  const handlePageChange = (page: string) => {
    if (!user && isProtectedRoute(page)) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  const handleLogin = (email: string, password: string) => {
    // Demo authentication - in real app, this would call your auth API
    if (email === 'demo@ezgrades.com' && password === 'demo123') {
      const demoUser: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@ezgrades.com',
        username: 'Scholar'
      };
      setUser(demoUser);
      setCurrentPage('dashboard');
    } else {
      // For demo purposes, accept any email/password
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        username: 'Scholar'
      };
      setUser(newUser);
      setCurrentPage('dashboard');
    }
  };

  const handleGoogleAuth = (userData: { name: string; email: string; profilePicture?: string }) => {
    const googleUser: User = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      username: userData.name.split(' ')[0] || 'Scholar'
    };
    setUser(googleUser);
    setCurrentPage('dashboard');
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // Demo sign up - in real app, this would call your auth API
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      username: 'Scholar'
    };
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderPage = () => {
    // If no user is authenticated, always show auth pages
    if (!user) {
      // If trying to access protected route, redirect to login
      if (isProtectedRoute(currentPage)) {
        setCurrentPage('login');
      }
      
      if (currentPage === 'signup') {
        return (
          <SignUp
            onSignUp={handleSignUp}
            onGoogleSignUp={handleGoogleAuth}
            onSwitchToLogin={() => {
              setAuthMode('login');
              setCurrentPage('login');
            }}
          />
        );
      }
      
      // Default to login page for unauthenticated users
      return (
        <Login
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleAuth}
          onSwitchToSignup={() => {
            setAuthMode('signup');
            setCurrentPage('signup');
          }}
        />
      );
    }

    // Authenticated user pages
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'break':
        return <BreakMode />;
      case 'focus':
        return <FocusMode />;
      case 'studyhub':
        return <StudyHub user={user} />;
      case 'summary':
        return <Summary />;
      case 'settings':
        return <Settings onLogout={handleLogout} user={user} onUserUpdate={handleUserUpdate} />;
      // If user is authenticated but on auth page, redirect to dashboard
      case 'login':
      case 'signup':
        setCurrentPage('dashboard');
        return <Dashboard user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  // Show loading screen while checking for existing session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto border-4 border-primary-solid border-t-transparent rounded-full"
          />
          <div className="space-y-2">
            <h1 className="text-gradient-primary">EZ Grades</h1>
            <p className="text-muted-foreground">Loading your session...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // If user is not authenticated, show auth pages without sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient flex w-full">
        {/* Theme Toggle in Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.main
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderPage()}
          </motion.main>
        </AnimatePresence>
      </div>
    );
  }

  // Authenticated user gets full app with sidebar
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-gradient flex w-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={handlePageChange}
            user={user}
            onLogout={handleLogout}
          />
        )}
        
        <SidebarInset className="bg-transparent relative">
          {/* Mobile Top Navigation */}
          {isMobile && user && (
            <MobileTopNavigation user={user} />
          )}
          
          <AnimatePresence mode="wait">
            <motion.main
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`w-full ${isMobile ? 'pt-20' : ''}`}
            >
              {renderPage()}
            </motion.main>
          </AnimatePresence>

          {/* Mobile Navigation */}
          {isMobile && user && (
            <MobileNavigation
              currentPage={currentPage}
              onPageChange={handlePageChange}
              user={user}
              onLogout={handleLogout}
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}