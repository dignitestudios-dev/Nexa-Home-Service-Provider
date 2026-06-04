"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromoteAdvertisementMutation } from "@/hooks/advertisement/use-promote-advertisement-mutation";
import { useSubscriptionPlansQuery } from "@/hooks/billing/use-subscription-plans-query";
import { toast } from "@/lib/toast";

import MediaUploadField from "./media-upload-field";
import PromotionPackageCard from "./promotion-package-card";
import ServiceSelectField from "./service-select-field";
import TargetLocationSelectField from "./target-location-select-field";

function PackageCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[247px] animate-pulse rounded-[16px] bg-[rgba(0,88,100,0.06)] px-3 py-4"
        >
          <div className="h-7 w-16 rounded-full bg-[#E8E8E8]" />
          <div className="mt-4 h-5 w-32 rounded bg-[#E8E8E8]" />
          <div className="mt-3 h-7 w-20 rounded bg-[#E8E8E8]" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 3 }).map((__, featureIndex) => (
              <div
                key={featureIndex}
                className="h-4 w-full rounded bg-[#E8E8E8]"
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const MAX_TARGET_RADIUS_MILES = 600;

function isValidPromotionLink(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdPromotionForm() {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [targetRadiusMiles, setTargetRadiusMiles] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );

  const promoteMutation = usePromoteAdvertisementMutation();

  const {
    data: plans = [],
    isLoading,
    isPending,
    isFetching,
    isFetched,
    isError,
    refetch,
  } = useSubscriptionPlansQuery({ type: "advertisement" });

  const isLoadingPlans =
    isLoading || isPending || (isFetching && !isFetched);

  useEffect(() => {
    if (selectedPackageId || plans.length === 0) return;
    setSelectedPackageId(plans[0].id);
  }, [plans, selectedPackageId]);

  const handleNext = async () => {
    if (!mediaFile) {
      toast.error("Please upload an image or video.");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a target location.");
      return;
    }

    const radius = Number(targetRadiusMiles.trim());
    if (!Number.isFinite(radius) || radius <= 0) {
      toast.error("Please enter a valid target radius in miles.");
      return;
    }

    if (radius > MAX_TARGET_RADIUS_MILES) {
      toast.error(
        `Target radius cannot exceed ${MAX_TARGET_RADIUS_MILES} miles.`,
      );
      return;
    }

    if (selectedServiceIds.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }

    if (selectedServiceIds.length > 1) {
      toast.error("Please select only one service for ad promotion.");
      return;
    }

    const trimmedLink = link.trim();
    if (!trimmedLink) {
      toast.error("Please add a link.");
      return;
    }

    if (!isValidPromotionLink(trimmedLink)) {
      toast.error("Please enter a valid URL starting with http:// or https://.");
      return;
    }

    if (!selectedPackageId) {
      toast.error("Please select a package.");
      return;
    }

    await promoteMutation.mutateAsync({
      media: mediaFile,
      addressId: selectedAddressId,
      targetRadiusMiles: radius,
      categoryId: selectedServiceIds[0],
      link: trimmedLink,
      planId: selectedPackageId,
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <MediaUploadField file={mediaFile} onFileChange={setMediaFile} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <TargetLocationSelectField
            selectedAddressId={selectedAddressId}
            onChange={setSelectedAddressId}
          />

          <div className="mt-4">
            <label
              htmlFor="target-radius"
              className="text-[16px] font-[500] leading-[22px] tracking-[-0.408px] text-black"
            >
              Target Radius (miles)
            </label>
            <Input
              id="target-radius"
              type="number"
              min={1}
              max={MAX_TARGET_RADIUS_MILES}
              value={targetRadiusMiles}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "") {
                  setTargetRadiusMiles("");
                  return;
                }

                const radius = Number(value);
                if (!Number.isFinite(radius)) return;

                setTargetRadiusMiles(
                  String(Math.min(MAX_TARGET_RADIUS_MILES, Math.max(0, radius))),
                );
              }}
              placeholder="e.g., 600"
              className="mt-[7px] h-12 rounded-[12px] border-0 bg-white px-4 text-[16px] shadow-none placeholder:text-[rgba(24,24,24,0.8)] focus-visible:ring-0"
            />
          </div>
        </div>

        <ServiceSelectField
          selectedServiceIds={selectedServiceIds}
          onChange={setSelectedServiceIds}
        />
      </div>

      <div>
        <label
          htmlFor="promotion-link"
          className="text-[16px] font-[500] leading-[22px] tracking-[-0.408px] text-black"
        >
          Link
        </label>
        <Input
          id="promotion-link"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://www.example.com/contact"
          className="mt-[7px] h-12 rounded-[12px] border-0 bg-white px-4 text-[16px] shadow-none placeholder:text-[rgba(24,24,24,0.8)] focus-visible:ring-0"
        />
      </div>

      <div className="border-t border-[#D3D3D3] pt-6">
        <h3 className="text-[24px] font-[600] leading-[30px] text-black">
          Select Package
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoadingPlans ? (
            <PackageCardsSkeleton />
          ) : isError ? (
            <div className="col-span-full rounded-[12px] bg-white px-4 py-6 text-center">
              <p className="text-[15px] text-black/70">
                Unable to load packages. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : plans.length === 0 ? (
            <p className="col-span-full text-[15px] text-black/70">
              No advertisement packages available.
            </p>
          ) : (
            plans.map((plan) => (
              <PromotionPackageCard
                key={plan.id}
                label={plan.name}
                price={plan.amount}
                features={plan.description}
                selected={selectedPackageId === plan.id}
                onSelect={() => setSelectedPackageId(plan.id)}
              />
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={handleNext}
            disabled={
              !selectedPackageId || isLoadingPlans || promoteMutation.isPending
            }
            className="h-12 w-full max-w-[252px] rounded-[12px] bg-[#005864] text-[16px] font-[600] capitalize leading-5 text-white hover:bg-[#004d57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {promoteMutation.isPending ? "Processing..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
