import type { LucideIcon } from "lucide-react";

export interface HealthMetric {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  progress: number;
}
