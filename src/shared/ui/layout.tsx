import { BottomNav } from "@/features/bottom-tab/bottom-tab";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function MainLayout({
  children,
  hideBottomNav = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <main className="flex-1 pb-16">{children}</main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
