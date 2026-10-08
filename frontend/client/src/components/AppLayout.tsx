import React from "react";
import DashboardLayout from "./DashboardLayout";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}

export default AppLayout;
