"use client";

import TransactionHistoryPanel from "./_components/transaction-history-panel";

export default function TransactionHistoryPage() {
  return (
    <div className="mx-auto flex w-full max-w-[940px] flex-col">
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">
        Transaction History
      </h2>

      <TransactionHistoryPanel />
    </div>
  );
}
