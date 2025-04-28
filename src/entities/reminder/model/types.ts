import type React from "react";
export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  isAlert?: boolean;
  icon: React.ReactNode;
}
