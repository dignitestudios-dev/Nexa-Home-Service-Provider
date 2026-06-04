import type { ReactNode } from "react";
import MainAppShell from "@/components/layout/main-app-shell";
import ProtectedRoute from "@/routes/ProtectedRoutes";
import SettingsSidebar from "./_components/settings-sidebar";

export default function ProfileSettingsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <MainAppShell>
        <h1 className="text-[32px] font-[600] leading-10 text-black mt-10">Settings</h1>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
          <SettingsSidebar />
          <section className="min-h-[988px] rounded-[24px] bg-[#F8F8F8] p-6 md:p-6">
            {children}
          </section>
        </div>
      </MainAppShell>
    </ProtectedRoute>
  );
}
