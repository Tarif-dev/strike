import { Home, Calendar, Trophy, User, Wallet, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/home", label: "Home" },
    { icon: Calendar, path: "/matches", label: "Matches" },
    { icon: Trophy, path: "/leagues", label: "Leagues" },
    { icon: Wallet, path: "/wallet", label: "Wallet" },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-2 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/home" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                isActive
                  ? "text-neon-green"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "fill-neon-green/10")}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
