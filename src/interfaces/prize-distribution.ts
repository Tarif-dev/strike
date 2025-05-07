/**
 * Type definitions for prize distribution features
 */
import { TeamData } from "@/types/match";

/**
 * Prize distribution result interface that includes:
 * - distributions: Formatted strings for display
 * - percentages: Numerical percentage values (0-100)
 * - amounts: Actual prize amounts in USDC
 * - message: A string representation of all distributions
 */
export interface PrizeDistributionResult {
  distributions: Record<string, string>;
  message: string;
  percentages: Record<string, number>;
  amounts: Record<string, number>;
}

/**
 * Props for PrizeDistributionDisplay component
 */
export interface PrizeDistributionDisplayProps {
  distributions: Record<string, string>;
  percentages: Record<string, number>;
  amounts: Record<string, number>;
  teamId?: string; // Current team ID to highlight
  className?: string;
}

/**
 * Props for PrizePoolDisplay component
 */
export interface PrizePoolDisplayProps {
  prizePool: string | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
}
