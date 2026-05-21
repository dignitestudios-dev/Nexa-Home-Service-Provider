import AuthLayout from "@/components/auth/auth-layout";
import OnboardingLayout from "@/components/onboarding/onboarding-layout";
import ProtectedRoute from "@/routes/ProtectedRoutes";

export default function OnboardingRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <OnboardingLayout>{children}</OnboardingLayout>
    </ProtectedRoute>
  );
}
