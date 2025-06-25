"use client";

interface SkeletonProps {
  className?: string;
}

export function SkeletonLine({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4" />

      <div className="flex gap-4 mb-6">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="h-5 bg-gray-200 rounded mb-3 w-24" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>

        <div>
          <div className="h-5 bg-gray-200 rounded mb-3 w-28" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="h-5 bg-gray-200 rounded mb-3 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center p-2 bg-gray-50 rounded">
              <div className="h-6 bg-gray-200 rounded mb-1" />
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonRecipeList({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded mb-2 w-56" />
        <div className="h-4 bg-gray-200 rounded w-72" />
      </div>

      <div className="space-y-6">
        {[...Array(count)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
