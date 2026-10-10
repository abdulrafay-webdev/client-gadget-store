import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between">
      <div>
        <div className="aspect-square w-full bg-[#1A1A1A]" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-1/3 bg-[#222222] rounded" />
          <div className="h-4 w-4/5 bg-[#252525] rounded" />
          <div className="h-4 w-2/5 bg-[#2A2A2A] rounded" />
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-9 w-full bg-[#1E1E1E] rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
