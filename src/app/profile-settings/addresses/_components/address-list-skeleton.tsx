function AddressCardSkeleton() {
  return (
    <article className="animate-pulse rounded-[12px] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[520px] flex-1 space-y-3">
          <div className="h-6 w-32 rounded-md bg-[#E8E8E8]" />
          <div className="flex items-start gap-2">
            <div className="mt-1 h-[17px] w-[17px] shrink-0 rounded-full bg-[#E8E8E8]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full max-w-[420px] rounded-md bg-[#E8E8E8]" />
              <div className="h-4 w-3/4 max-w-[320px] rounded-md bg-[#E8E8E8]" />
            </div>
          </div>
          <div className="h-4 w-28 rounded-md bg-[#E8E8E8]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[42px] w-[42px] rounded-[6px] bg-[#E8E8E8]" />
          <div className="h-[42px] w-[42px] rounded-[6px] bg-[#E8E8E8]" />
        </div>
      </div>
    </article>
  );
}

export default function AddressListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <AddressCardSkeleton key={index} />
      ))}
    </div>
  );
}
