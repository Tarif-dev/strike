import React from "react";

type LoadingOverlayProps = {
  isVisible: boolean;
  message?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Processing transaction...",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-neon-green/30 rounded-lg p-8 max-w-md w-full shadow-lg shadow-neon-green/20">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-t-neon-green border-r-neon-green/30 border-b-neon-green/10 border-l-transparent rounded-full animate-spin"></div>

            {/* Inner ring */}
            <div className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-neon-green/50 border-l-neon-green/30 rounded-full animate-spin animation-delay-500"></div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            </div>
          </div>

          <p className="text-neon-green text-lg font-medium mb-2">{message}</p>
          <p className="text-gray-400 text-sm text-center">
            This may take a few moments. Please do not close this window.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
