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
    </header>
  );
}
