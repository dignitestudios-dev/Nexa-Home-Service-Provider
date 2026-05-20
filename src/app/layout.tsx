import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "NexaHome Partner | CRM & Business Intelligence Dashboard",
  description:
    "NexaHome Partner is a modern CRM platform to manage vendors, referrals, CSV imports, revenue insights, and business operations from one unified dashboard.",
  icons: {
    icon: "/asset/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
