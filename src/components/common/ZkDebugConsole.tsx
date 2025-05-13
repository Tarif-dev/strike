import React, { useState, useEffect } from "react";

interface LogData {
  timestamp: string;
  type: "info" | "success" | "error" | "warn";
  message: string;
}

interface ZkDebugConsoleProps {
  isEnabled?: boolean;
}

const ZkDebugConsole: React.FC<ZkDebugConsoleProps> = ({
  isEnabled = true,
}) => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showClearedMessage, setShowClearedMessage] = useState(false);

  // Create a ref to the original console methods
  const originalConsole = React.useRef({
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  });

  // Format current time
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
  };

  // Add a log entry
  const addLog = (type: LogData["type"], args: any[]) => {
    const message = args
      .map((arg) => {
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: getCurrentTime(),
        type,
        message,
      },
    ]);
  };

  // Intercept console methods
  useEffect(() => {
    if (!isEnabled) return;

    // Override console methods
    console.log = (...args: any[]) => {
      originalConsole.current.log(...args);
      addLog("info", args);
    };

    console.info = (...args: any[]) => {
      originalConsole.current.info(...args);
      addLog("info", args);
    };

    console.warn = (...args: any[]) => {
      originalConsole.current.warn(...args);
      addLog("warn", args);
    };

    console.error = (...args: any[]) => {
      originalConsole.current.error(...args);
      addLog("error", args);
    };

    // Restore original console on unmount
    return () => {
      console.log = originalConsole.current.log;
      console.info = originalConsole.current.info;
      console.warn = originalConsole.current.warn;
      console.error = originalConsole.current.error;
    };
  }, [isEnabled]);

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    setShowClearedMessage(true);
    setTimeout(() => setShowClearedMessage(false), 1500);
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Console Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-900 hover:bg-gray-800 text-neon-green p-2 rounded-full shadow-lg flex items-center justify-center"
        title="ZK Debug Console"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {logs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {logs.length}
          </span>
        )}
      </button>

      {/* Console Panel */}
      {isVisible && (
        <div className="fixed bottom-24 right-4 w-full max-w-lg bg-gray-900 border border-neon-green/20 rounded-lg shadow-xl shadow-neon-green/10 overflow-hidden">
          <div className="flex items-center justify-between bg-gray-800 p-2 border-b border-neon-green/20">
            <div className="text-neon-green font-mono text-sm">
              ZK Debug Console
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearLogs}
                className="text-gray-400 hover:text-neon-green"
                title="Clear console"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-neon-green"
                title="Close console"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-2 font-mono text-xs">
            {showClearedMessage ? (
              <div className="text-gray-400 italic">Console was cleared</div>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-1 ${index % 2 === 0 ? "bg-gray-800/50" : ""} p-1 rounded`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                  <span
                    className={
                      log.type === "error"
                        ? "text-red-400"
                        : log.type === "warn"
                          ? "text-yellow-400"
                          : log.type === "success"
                            ? "text-green-400"
                            : "text-blue-400"
                    }
                  >
                    {log.type.toUpperCase()}:
                  </span>{" "}
                  <span className="text-gray-300 whitespace-pre-wrap break-words">
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No logs yet...</div>
            )}
          </div>

          <div className="bg-gray-800 p-2 border-t border-neon-green/20 text-xs text-gray-400">
            Logs for ZK Compression operations
          </div>
        </div>
      )}
    </div>
  );
};

export default ZkDebugConsole;
