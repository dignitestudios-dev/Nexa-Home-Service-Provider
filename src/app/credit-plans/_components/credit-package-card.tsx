type CreditPackageCardProps = {
  name: string;
  credits: number;
  price: number;
  purchased?: boolean;
  selected?: boolean;
  onSelect: () => void;
};

export default function CreditPackageCard({
  name,
  credits,
  price,
  purchased = false,
  selected = false,
  onSelect,
}: CreditPackageCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full rounded-[24px] bg-[#F8F8F8] px-6 py-6 text-center transition-shadow ${
        selected ? "ring-2 ring-[#005864]" : "hover:opacity-95"
      }`}
    >
      {purchased ? (
        <span className="absolute right-4 top-4 rounded-full bg-[#005864] px-2.5 py-2 text-[12px] font-medium capitalize leading-[15px] text-white">
          Purchased
        </span>
      ) : null}

      <p className="text-[20px] font-medium leading-[25px] text-[#1C1C1C]">{name}</p>

      <p className="mt-4 text-[40px] font-bold leading-[50px] text-[#005864]">
        {credits.toLocaleString("en-US")}
      </p>

      <p className="mt-1 text-[18px] font-semibold leading-[23px] text-black">Credits</p>

      <p className="mt-3 text-[20px] leading-[25px] text-black">
        For{" "}
        <span className="font-bold">${price.toLocaleString("en-US")}</span>
      </p>
    </button>
  );
}
