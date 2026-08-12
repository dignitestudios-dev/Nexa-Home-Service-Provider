import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-4xl font-bold text-[#005864]">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#005864] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#004650]"
      >
        Return Home
      </Link>
    </div>
  );
}
