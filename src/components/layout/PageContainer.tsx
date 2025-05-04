import { ReactNode } from "react";
import DemoBanner from "@/components/common/DemoBanner";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  hideDemoBanner?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  hideDemoBanner = false,
}: PageContainerProps) {
  return (
    <div className={`app-container pb-20 ${className}`}>
      {!hideDemoBanner && <DemoBanner />}
      {children}
    </div>
  );
}
