import ProtectedRoute from "@/routes/ProtectedRoutes";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
