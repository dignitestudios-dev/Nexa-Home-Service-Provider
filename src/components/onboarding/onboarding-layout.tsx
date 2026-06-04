import type { ReactNode } from "react";

import OnboardingLogoutButton from "@/components/onboarding/onboarding-logout-button";
import { OnboardingStepGuard } from "@/components/onboarding/onboarding-step-guard";
import { PreventOtpBackNavigation } from "@/components/onboarding/prevent-otp-back-navigation";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative w-full min-h-screen">
      <OnboardingStepGuard />
      <PreventOtpBackNavigation />
      <OnboardingLogoutButton />
      {children}
    </div>
  );
}
