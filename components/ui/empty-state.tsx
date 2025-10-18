"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  imageSrc = "/medical-assistance.png",
}: EmptyStateProps) {
  return (
    <div
      className="flex items-center flex-col justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-card/50"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <Image src={imageSrc} alt="Empty" width={180} height={180} />
      <h2 className="font-serif font-bold text-2xl mt-6 text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground font-sans mt-2 text-center max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
