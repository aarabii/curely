"use client";
import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[400px] p-8"
        >
          <div className="max-w-md text-center space-y-6 p-8 border-2 border-destructive/50 rounded-2xl bg-destructive/5">
            <div className="text-6xl">⚠️</div>
            <h2 className="font-serif font-bold text-3xl text-destructive">
              Something went wrong
            </h2>
            <p className="text-muted-foreground font-sans">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="transition-transform hover:scale-105 active:scale-98"
            >
              Reload Page
            </Button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
