import AuthLayout from "@/components/auth/auth-layout";
import ProtectedRoute from "@/routes/ProtectedRoutes";

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AuthLayout>{children}</AuthLayout>
    </ProtectedRoute>
  );
}
