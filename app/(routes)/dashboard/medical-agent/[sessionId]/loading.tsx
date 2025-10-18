"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AgentLoading() {
  return (
    <div className="container-grid py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-3 h-4 w-28" />
            <Skeleton className="mt-3 h-20 w-full" />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-5 w-28" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
