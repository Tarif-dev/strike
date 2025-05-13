// This file contains utility functions for ZK Compression operations
import { toast } from "@/components/ui/use-toast";

// Success notification
export const notifySuccess = (title: string, description: string = "") => {
  toast({
    title,
    description,
    variant: "success",
  });
};

// Error notification
export const notifyError = (title: string, description: string = "") => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

// Info notification
export const notifyInfo = (title: string, description: string = "") => {
  toast({
    title,
    description,
  });
};

// Format public key for display (truncate middle)
export const formatPublicKey = (publicKey: string): string => {
  if (!publicKey || publicKey.length <= 10) return publicKey;
  return `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`;
};

// Format tokens with decimals
export const formatTokenAmount = (
  amount: number,
  decimals: number = 9
): string => {
  return (amount / Math.pow(10, decimals)).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
};

// Copy to clipboard with notification
export const copyToClipboard = async (
  text: string,
  description: string = "Copied to clipboard"
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    notifySuccess("Copied", description);
  } catch (error) {
    notifyError("Failed to copy", "Could not copy the text to clipboard");
    console.error("Failed to copy text:", error);
  }
};
