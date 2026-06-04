import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexaHome Service Provider",
    template: "%s | NexaHome Service Provider",
  },
  description:
    "Find homeowner jobs, apply for projects, manage your work, and grow your home services business with NexaHome Service Provider.",
  applicationName: "NexaHome Service Provider",
  keywords: [
    "NexaHome",
    "service provider",
    "home services",
    "contractor jobs",
    "home improvement",
    "find jobs",
    "apply for jobs",
  ],
  authors: [{ name: "NexaHome" }],
  creator: "NexaHome",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NexaHome Service Provider",
    title: "NexaHome Service Provider",
    description:
      "Find homeowner jobs, apply for projects, manage your work, and grow your home services business with NexaHome Service Provider.",
    images: [
      {
        url: "/asset/darklogo.png",
        alt: "NexaHome Service Provider",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "NexaHome Service Provider",
    description:
      "Find homeowner jobs, apply for projects, manage your work, and grow your home services business with NexaHome Service Provider.",
    images: ["/asset/darklogo.png"],
  },
  icons: {
    icon: "/asset/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
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
