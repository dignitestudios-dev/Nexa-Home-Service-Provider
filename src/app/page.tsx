import AuthLayout from "@/components/auth/auth-layout";
import LoginForm from "@/components/auth/login-form";
import ProtectedRoute from "@/routes/ProtectedRoutes";

export default function Home() {
  return (
    <ProtectedRoute>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </ProtectedRoute>
  );
}
