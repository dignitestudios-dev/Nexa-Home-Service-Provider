function InfoRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="h-4 w-28 rounded-md bg-[#E8E8E8]" />
      <div className="h-4 w-24 rounded-md bg-[#E8E8E8]" />
    </div>
  );
}

export default function JobDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1470px] animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#E8E8E8]" />
        <div className="h-10 w-40 rounded-md bg-[#E8E8E8]" />
      </div>

      <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex w-full max-w-[930px] flex-col gap-6">
          <section className="rounded-[18px] bg-[#F8F8F8] p-6">
            <div className="h-7 w-56 rounded-md bg-[#E8E8E8]" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded-md bg-[#E8E8E8]" />
              <div className="h-4 w-full rounded-md bg-[#E8E8E8]" />
              <div className="h-4 w-4/5 rounded-md bg-[#E8E8E8]" />
            </div>
          </section>

          <section className="rounded-[12px] bg-[#F8F8F8] px-6 py-6">
            <div className="flex flex-col gap-3">
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton />
            </div>
          </section>

          <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-6">
            <div className="h-5 w-28 rounded-md bg-[#E8E8E8]" />
            <div className="mt-4 flex gap-2">
              <div className="h-[70px] w-[70px] rounded-[12px] bg-[#E8E8E8]" />
              <div className="h-[70px] w-[70px] rounded-[12px] bg-[#E8E8E8]" />
              <div className="h-[70px] w-[70px] rounded-[12px] bg-[#E8E8E8]" />
            </div>
          </section>

          <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-6">
            <div className="h-5 w-24 rounded-md bg-[#E8E8E8]" />
            <div className="mt-4 h-4 w-64 rounded-md bg-[#E8E8E8]" />
          </section>
        </div>

        <aside className="w-full max-w-[638px] rounded-[18px] bg-[#F8F8F8] px-[30px] pb-8 pt-6 xl:min-h-[496px]">
          <div className="mx-auto h-5 w-32 rounded-md bg-[#E8E8E8]" />
          <div className="mx-auto mt-6 h-[140px] w-[140px] rounded-full bg-[#E8E8E8]" />
          <div className="mx-auto mt-5 h-7 w-40 rounded-md bg-[#E8E8E8]" />
          <div className="mt-6 space-y-2">
            <div className="h-20 rounded-[12px] bg-[#E8E8E8]" />
            <div className="h-20 rounded-[12px] bg-[#E8E8E8]" />
          </div>
        </aside>
      </div>
    </div>
  );
}
