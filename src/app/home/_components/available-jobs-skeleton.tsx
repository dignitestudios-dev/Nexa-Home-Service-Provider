function JobCardSkeleton() {
  return (
    <article className="animate-pulse rounded-[12px] bg-[#F8F8F8] p-4">
      <div className="h-6 w-40 rounded-md bg-[#E8E8E8]" />
      <div className="mt-2 space-y-2">
        <div className="h-4 w-full rounded-md bg-[#E8E8E8]" />
        <div className="h-4 w-4/5 rounded-md bg-[#E8E8E8]" />
      </div>
      <div className="mt-3 h-5 w-28 rounded-md bg-[#E8E8E8]" />
      <div className="mt-4 rounded-[12px] bg-[rgba(0,88,100,0.06)] px-3 py-2">
        <div className="h-3 w-10 rounded-md bg-[#E8E8E8]" />
        <div className="mt-2 h-4 w-24 rounded-md bg-[#E8E8E8]" />
      </div>
    </article>
  );
}

export default function AvailableJobsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </section>
  );
}
