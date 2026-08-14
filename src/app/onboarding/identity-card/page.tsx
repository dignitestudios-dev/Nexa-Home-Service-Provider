"use client";

import { useState } from "react";
import {
  IdCard,
  UserRound,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { persistAuthUser } from "@/lib/auth-session";
import { mergeUserOnboardingFlags } from "@/lib/onboarding-steps";
import { markWalkthroughPending } from "@/lib/walkthrough-storage";
import type { RootState } from "@/store/index";
import { singUp } from "@/store/slices/auth-slice";
import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { toast } from "@/lib/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: true },
];

export default function IdentityCardOnboardingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isStarting, setIsStarting] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

  const fetchStatusAndComplete = async () => {
    setIsFetchingStatus(true);
    try {
      const response = await userService.getVerificationStatus();
      const data = response.data;
      
      if (user) {
        const nextUser = mergeUserOnboardingFlags(user, {
          identityStatus: data?.identityStatus ?? "pending",
        });
        persistAuthUser(nextUser);
        dispatch(singUp(nextUser));
        markWalkthroughPending(nextUser._id);
      }

      router.replace("/onboarding/account-status?status=submitted");
    } catch (error) {
      const msg = getApiErrorMessage(error, "Failed to load verification status.");
      if (msg) toast.error(msg);
      // fallback navigate anyway
      if (user) {
        const nextUser = mergeUserOnboardingFlags(user, {
          identityStatus: "pending",
        });
        persistAuthUser(nextUser);
        dispatch(singUp(nextUser));
        markWalkthroughPending(nextUser._id);
      }
      router.replace("/onboarding/account-status?status=submitted");
    } finally {
      setIsFetchingStatus(false);
    }
  };

  const handleStartVerification = async () => {
    try {
      setIsStarting(true);
      const response = await userService.startVerification();
      const sessionUrl = response.data?.sessionUrl;

      if (!sessionUrl) {
        throw new Error("Invalid session URL");
      }

      createVeriffFrame({
        url: sessionUrl,
        onEvent: (msg) => {
          if (msg === MESSAGES.FINISHED) {
            fetchStatusAndComplete();
          }
        },
      });
    } catch (error) {
      const msg = getApiErrorMessage(error, "Could not start verification. Please try again.");
      if (msg) toast.error(msg);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col rounded-[32px] bg-white p-0 lg:flex-row">
        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:sticky lg:top-0 lg:block">
          <div className="relative z-10 flex h-full w-full items-start md:pt-[6em] px-20">
            <div className="flex w-full max-w-[199px] flex-col gap-1">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                const isLastStep = index === stepItems.length - 1;
                return (
                  <div key={step.label} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${
                          step.active ? "bg-white" : "bg-white/30"
                        }`}
                      >
                        <Icon
                          size={23}
                          className={
                            step.active ? "text-[#005864]" : "text-white/70"
                          }
                        />
                      </div>
                      <span
                        className={`text-[14px] leading-[17px] tracking-[-0.008em] ${
                          step.active ? "text-white" : "text-white/60"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {!isLastStep && (
                      <div
                        className="ml-6 h-8 w-px bg-white/30"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-6 sm:px-8 lg:px-16 lg:py-14">
          <div className="w-full max-w-[496px] pb-6 text-center">
            <h1 className="text-[36px] font-semibold leading-[45px] tracking-[-0.82px] text-[#1C1C1C]">
              Verify Your Identity
            </h1>
            <p className="mt-4 text-[16px] leading-[22px] text-black/80 mb-10">
              Please verify your identity using a government-issued ID (e.g.,
              driver&apos;s license, state ID, or passport). This helps us
              keep NexaHome safe for everyone.
            </p>

            <Button
              onClick={handleStartVerification}
              disabled={isStarting || isFetchingStatus}
              className="h-14 w-full max-w-[388px] rounded-full bg-[#005864] text-white hover:bg-[#004d57] font-[600] text-lg"
            >
              {isStarting || isFetchingStatus ? "Loading..." : "Start Verification"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
