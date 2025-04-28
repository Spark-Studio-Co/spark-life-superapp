import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  to: string;
}
