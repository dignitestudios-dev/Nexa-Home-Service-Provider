"use client";

import { useState } from "react";

import MainAppShell from "@/components/layout/main-app-shell";

import CreditPackageCard from "./_components/credit-package-card";

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Package",
    credits: 500,
    price: 50,
    purchased: false,
  },
  {
    id: "advanced",
    name: "Advanced Package",
    credits: 1000,
    price: 250,
    purchased: true,
  },
] as const;

export default function CreditPlansPage() {
  const [selectedPackageId, setSelectedPackageId] =
    useState<(typeof CREDIT_PACKAGES)[number]["id"]>("starter");

  return (
    <MainAppShell>
      <div className="mx-auto w-full max-w-[1420px] pb-10">
        <h1 className="text-[32px] font-semibold capitalize leading-[40px] text-black ml-10">
          Credit Plan
        </h1>

        <div className="mx-auto flex w-full max-w-[700px] flex-col pt-8">
          <p className="mx-auto max-w-[607px] text-center text-[16px] leading-6 tracking-[-0.014em] text-[#565656]">
            Choose a credit plan that fits your needs. Use credits to unlock jobs and
            connect directly with homeowners. You can upgrade or buy more credits anytime.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[500px] flex-col gap-4">
            {CREDIT_PACKAGES.map((creditPackage) => (
              <CreditPackageCard
                key={creditPackage.id}
                name={creditPackage.name}
                credits={creditPackage.credits}
                price={creditPackage.price}
                purchased={creditPackage.purchased}
                selected={selectedPackageId === creditPackage.id}
                onSelect={() => setSelectedPackageId(creditPackage.id)}
              />
            ))}
          </div>

          <div className="mx-auto mt-4 w-full max-w-[500px] rounded-[24px] bg-[#F9FAFA] px-6 py-8 text-center">
            <h2 className="text-[20px] font-medium leading-[25px] text-[#005864]">
              Custom Package
            </h2>
            <p className="mx-auto mt-3 max-w-[430px] text-[16px] leading-5 text-black">
              Manually choose how many credits you want to buy and we&apos;ll adjust the
              price accordingly.
            </p>
          </div>

          <button
            type="button"
            className="mx-auto mt-8 h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] text-[16px] font-semibold capitalize leading-5 text-white transition-opacity hover:opacity-90"
          >
            Buy Now
          </button>
        </div>
      </div>
    </MainAppShell>
  );
}
