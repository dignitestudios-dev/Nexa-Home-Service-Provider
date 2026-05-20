import type { ReactNode } from "react";
import HomeHeader from "../home/_components/home-header";
import SettingsSidebar from "./_components/settings-sidebar";

export default function ProfileSettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white p-3 md:p-5">
      <div className="mx-auto w-full max-w-[1440px] rounded-[32px] bg-white p-4 md:p-5">
        <HomeHeader />

        <h1 className="mt-10 text-[32px] font-[600] leading-10 text-black ml-4">Settings</h1>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
          <SettingsSidebar />
          <section className="rounded-[24px] bg-[#F8F8F8] p-6 md:p-8">{children}</section>
        </div>
      </div>
    </div>
  );
}
