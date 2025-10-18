"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="container-grid py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-[32rem]" />
        </div>
        <div className="shrink-0">
          <Skeleton className="h-10 w-44" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-3 h-4 w-48" />
            <Skeleton className="mt-5 h-8 w-28" />
            <Skeleton className="mt-6 h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-xl border border-border bg-card p-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-3 h-4 w-[28rem]" />
        <Skeleton className="mt-6 h-[420px] w-full" />
      </div>
    </div>
  );
}
