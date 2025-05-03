import React from "react";

interface InitialsAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = "md",
  className = "",
}) => {
  // Generate initials from name
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Size mapping
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <div
      className={`bg-white text-cricket-dark-green font-bold rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
