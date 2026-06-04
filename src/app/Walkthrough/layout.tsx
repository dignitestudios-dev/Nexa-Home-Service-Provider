"use client";

import ProtectedRoute from "@/routes/ProtectedRoutes";

export default function WalkthroughLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
