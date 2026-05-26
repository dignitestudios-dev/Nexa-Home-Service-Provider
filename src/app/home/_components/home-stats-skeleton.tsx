function StatCardSkeleton() {
  return (
    <div className="relative h-[118px] w-[206px] animate-pulse overflow-hidden rounded-[12px] bg-[#005864] p-5">
      <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px] opacity-40" />
      <div className="relative space-y-3">
        <div className="h-9 w-20 rounded-md bg-white/20" />
        <div className="h-5 w-32 rounded-md bg-white/20" />
      </div>
    </div>
  );
}

export default function HomeStatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
