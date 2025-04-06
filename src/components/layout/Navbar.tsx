
import { Home, Calendar, Trophy, User, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Calendar, path: '/matches', label: 'Matches' },
    { icon: Trophy, path: '/leagues', label: 'Leagues' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cricket-medium-green p-2 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                isActive 
                  ? "text-cricket-lime" 
                  : "text-muted-foreground hover:text-cricket-lime"
              )}
            >
              <item.icon className="nav-icon" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
