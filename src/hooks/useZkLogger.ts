import { useEffect } from "react";

type LogLevel = "info" | "success" | "error" | "warn";

export const useZkLogger = (isEnabled: boolean = true) => {
  useEffect(() => {
    if (!isEnabled) return;

    console.info("ZK Logger initialized");
    console.info(
      "ZK Compression is a Solana primitive that enables state compression using Zero-Knowledge proofs"
    );

    console.info("Environment:", {
      isLocalnet: true,
      jsRuntimeVersion: process.version || "unknown",
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    console.info(
      "Ready for ZK Compression operations. Start the local validator with ./start-zk-validator.sh"
    );
  }, [isEnabled]);

  // Log ZK Compression operations
  const logOperation = (
    operation: string,
    details: Record<string, any>,
    level: LogLevel = "info"
  ) => {
    if (!isEnabled) return;

    const message = `ZK Operation [${operation}]: ${JSON.stringify(details, null, 2)}`;

    switch (level) {
      case "success":
        console.log(`✅ ${message}`);
        break;
      case "error":
        console.error(`❌ ${message}`);
        break;
      case "warn":
        console.warn(`⚠️ ${message}`);
        break;
      case "info":
      default:
        console.info(`ℹ️ ${message}`);
        break;
    }
  };

  return {
    logOperation,
    logMinting: (amount: number, destination: string) =>
      logOperation("Minting", { amount, destination }, "info"),
    logTransfer: (amount: number, source: string, destination: string) =>
      logOperation("Transfer", { amount, source, destination }, "info"),
    logSuccess: (operation: string, details: Record<string, any>) =>
      logOperation(operation, details, "success"),
    logError: (operation: string, error: any) =>
      logOperation(operation, { error: error.toString() }, "error"),
    logWarning: (operation: string, details: Record<string, any>) =>
      logOperation(operation, details, "warn"),
  };
};

export default useZkLogger;
