"use client";

type AdPromotionTab = "promotion" | "history";

type AdPromotionTabsProps = {
  activeTab: AdPromotionTab;
  onTabChange: (tab: AdPromotionTab) => void;
};

const TABS: { id: AdPromotionTab; label: string }[] = [
  { id: "promotion", label: "Ad Promotion" },
  { id: "history", label: "Ad History" },
];

export default function AdPromotionTabs({
  activeTab,
  onTabChange,
}: AdPromotionTabsProps) {
  return (
    <div className="inline-flex h-[46px] w-full max-w-[343px] rounded-[12px] bg-white p-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`h-[38px] flex-1 rounded-[8px] text-[16px] capitalize leading-5 transition ${
              isActive
                ? "bg-[#005864] font-[500] text-white"
                : "bg-[#F9FAFA] font-[400] text-[rgba(24,24,24,0.8)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export type { AdPromotionTab };
