"use client";
import React from "react";
import AppHeader from "./_components/AppHeader";
import ErrorBoundary from "@/components/ErrorBoundary";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <ErrorBoundary>
        <div className="container-grid py-10">{children}</div>
      </ErrorBoundary>
    </div>
  );
}

export default DashboardLayout;
