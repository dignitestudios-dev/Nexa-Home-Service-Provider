type PromotionPackageCardProps = {
  label: string;
  price: number;
  features: string[];
  selected?: boolean;
  onSelect: () => void;
};

export default function PromotionPackageCard({
  label,
  price,
  features,
  selected = false,
  onSelect,
}: PromotionPackageCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative min-h-[247px] w-full rounded-[16px] bg-[rgba(0,88,100,0.06)] px-3 py-4 text-left transition ${
        selected ? "ring-2 ring-[#005864]" : "hover:opacity-95"
      }`}
    >
      <span className="absolute right-3 top-4 rounded-full bg-[#005864] px-2 py-1 text-[12px] leading-5 text-white">
        {label}
      </span>

      <p className="pr-16 text-[16px] font-[600] leading-5 text-black">
        Select Package
      </p>

      <p className="mt-2 text-[20px] font-[700] capitalize leading-[25px] text-[#005864]">
        ${price.toFixed(2)}
      </p>

      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li
            key={`${feature}-${index}`}
            className="text-[12px] leading-5 tracking-[0.08px] text-[rgba(24,24,24,0.8)]"
          >
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
}
