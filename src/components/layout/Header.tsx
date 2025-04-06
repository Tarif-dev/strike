
import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showActions?: boolean;
}

export default function Header({ 
  title = "Dream Cricket", 
  showBackButton = false, 
  showActions = true 
}: HeaderProps) {
  return (
    <header className="py-4 px-1 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Link to="/" className="mr-2 p-2">
            <span className="text-cricket-lime">← Back</span>
          </Link>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {showActions && (
        <div className="flex items-center gap-4">
          <button className="p-2 text-foreground hover:text-cricket-lime">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-foreground hover:text-cricket-lime">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
