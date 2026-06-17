interface PageSkeletonProps {
  pagePath: string;
}

export default function PageSkeleton({ pagePath }: PageSkeletonProps) {
  // Styles for skeleton elements
  const pillStyle = "h-4 rounded-full bg-[#1A1A1A] skeleton-shimmer";

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-12">
      {/* 1. HOME SKELETON */}
      {(pagePath === "/" || pagePath === "") && (
        <div className="space-y-16 animate-pulse">
          {/* Hero space */}
          <div className="max-w-3xl mx-auto text-center space-y-8 pt-12">
            <div className={`w-36 h-6 rounded-full mx-auto bg-[#1A1A1A] skeleton-shimmer`} />
            <div className={`h-16 w-full rounded-2xl bg-[#1A1A1A] skeleton-shimmer`} />
            <div className={`h-6 w-3/4 mx-auto rounded-lg bg-[#1A1A1A] skeleton-shimmer`} />
            <div className="flex justify-center gap-4 pt-4">
              <div className="w-32 h-12 rounded-full bg-[#1A1A1A] skeleton-shimmer" />
              <div className="w-32 h-12 rounded-full bg-[#1A1A1A] skeleton-shimmer" />
            </div>
          </div>

          {/* Core grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="h-64 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-64 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-64 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* 2. OUR CRAFT SKELETON */}
      {pagePath === "/our-craft" && (
        <div className="space-y-12 max-w-5xl mx-auto">
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <div className="w-24 h-6 rounded-full bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded-lg bg-[#1A1A1A] skeleton-shimmer" />
          </div>

          {/* 4 sequential step blocks */}
          <div className="space-y-8 pt-8">
            <div className="h-44 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-44 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-44 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-44 rounded-3xl bg-[#1A1A1A] skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* 3. SERVICES SKELETON */}
      {pagePath === "/services" && (
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 max-w-2xl mx-auto text-center">
            <div className="w-28 h-6 rounded-full mx-auto bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-12 w-3/4 mx-auto rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-4 w-full rounded-lg bg-[#1A1A1A] skeleton-shimmer" />
          </div>

          {/* 8 Grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 rounded-[2rem] bg-[#1A1A1A] skeleton-shimmer" />
            ))}
          </div>
        </div>
      )}

      {/* 4. ABOUT SKELETON */}
      {pagePath === "/about" && (
        <div className="space-y-16 max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-4">
            <div className="w-24 h-6 rounded-full bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-12 w-2/3 rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-4 w-full rounded-lg bg-[#1A1A1A] skeleton-shimmer" />
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-6 w-1/2 rounded bg-[#1A1A1A] skeleton-shimmer" />
              <div className="h-24 rounded-lg bg-[#1A1A1A] skeleton-shimmer" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-1/2 rounded bg-[#1A1A1A] skeleton-shimmer" />
              <div className="h-24 rounded-lg bg-[#1A1A1A] skeleton-shimmer" />
            </div>
          </div>

          {/* Values panel */}
          <div className="h-60 rounded-[2rem] bg-[#1A1A1A] skeleton-shimmer" />
        </div>
      )}

      {/* 5. CONTACT SKELETON */}
      {pagePath === "/contact" && (
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="w-28 h-6 rounded-full bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-12 w-2/3 rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
          </div>

          {/* 2-column form structure */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form column (width 7) */}
            <div className="lg:col-span-7 h-[450px] rounded-[2rem] bg-[#1A1A1A] skeleton-shimmer" />
            
            {/* Metadata column (width 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="h-56 rounded-[2rem] bg-[#1A1A1A] skeleton-shimmer" />
              <div className="h-40 rounded-[2rem] bg-[#1A1A1A] skeleton-shimmer" />
            </div>
          </div>
        </div>
      )}

      {/* 6. LEGAL AGREEMENT SKELETON (Privacy / Terms) */}
      {(pagePath === "/privacy-policy" || pagePath === "/terms-of-service") && (
        <div className="space-y-8 max-w-3xl mx-auto pt-12">
          <div className="w-24 h-6 rounded-full bg-[#1A1A1A] skeleton-shimmer" />
          <div className="h-14 w-2/3 rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
          <div className="space-y-4 pt-6">
            <div className="h-6 w-40 rounded bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-32 rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-[#1A1A1A] skeleton-shimmer" />
            <div className="h-32 rounded-xl bg-[#1A1A1A] skeleton-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
}
