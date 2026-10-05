import type { ReactNode } from "react";

export default function TutorialOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-white">
      {children}
    </div>
  );
}
