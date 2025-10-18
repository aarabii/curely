import React from "react";
import AppHeader from "./_components/AppHeader";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container-grid py-10">{children}</div>
    </div>
  );
}

export default DashboardLayout;
