import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showActions?: boolean;
}

export default function Header({
  title = "Dream Cricket",
  showBackButton = false,
  showActions = true,
}: HeaderProps) {
  return (
    <header className="py-4 px-1 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Link to="/" className="mr-2 p-2">
            <span className="text-neon-green hover:text-neon-green-light">
              ← Back
            </span>
          </Link>
        )}
        <h1 className="text-xl font-bold neon-text">{title}</h1>
      </div>
      {showActions && (
        <div className="flex items-center gap-4">
          <button className="p-2 text-neon-green hover:text-neon-green-light">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-neon-green hover:text-neon-green-light">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
