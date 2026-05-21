import type { ReactNode } from "react";

import HomeHeader from "@/app/home/_components/home-header";

type MainAppShellProps = {
  children: ReactNode;
};

/** Shared shell: home + profile-settings (header outside white card). */
export default function MainAppShell({ children }: MainAppShellProps) {
  return (
    <div className="min-h-screen bg-[#ffff] p-3 md:p-5">
      <HomeHeader />

      <div className="mx-auto w-full max-w-[1440px] rounded-[32px] bg-white p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
