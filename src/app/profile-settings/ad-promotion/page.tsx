"use client";

import { useState } from "react";

import AdHistoryPanel from "./_components/ad-history-panel";
import AdPromotionForm from "./_components/ad-promotion-form";
import AdPromotionTabs, {
  type AdPromotionTab,
} from "./_components/ad-promotion-tabs";

export default function AdPromotionPage() {
  const [activeTab, setActiveTab] = useState<AdPromotionTab>("promotion");

  return (
    <div className="mx-auto flex w-full max-w-[914px] flex-col">
      <h2 className="text-[32px] font-[600] leading-[40px] text-[#1C1C1C]">
        Ad Promotion
      </h2>

      <div className="mt-6">
        <AdPromotionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "promotion" ? <AdPromotionForm /> : <AdHistoryPanel />}
    </div>
  );
}
