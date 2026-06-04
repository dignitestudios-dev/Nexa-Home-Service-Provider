"use client";

import { useRouter } from "next/navigation";

import { useGoogleLoginAuth } from "@/hooks/auth/use-auth-mutations";
import { extractAuthFromResponse } from "@/lib/auth-session";
import { getRedirectPath } from "@/lib/auth-utils";
import { isGoogleSignInCancelled } from "@/lib/firebase-google-auth";
import { toast } from "@/lib/toast";
import { setPendingVerifyEmail } from "@/lib/verify-email-storage";
import { cn } from "@/lib/utils";

type GoogleSignInButtonProps = {
  className?: string;
  onConflict?: () => void;
};

export function GoogleSignInButton({
  className,
  onConflict,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const googleLoginMutation = useGoogleLoginAuth();

  const handleGoogleSignIn = async () => {
    try {
      const { response, email } = await googleLoginMutation.mutateAsync();
      const record =
        response && typeof response === "object"
          ? (response as Record<string, unknown>)
          : null;
      const nested =
        record?.data && typeof record.data === "object"
          ? (record.data as Record<string, unknown>)
          : null;

      if (
        nested?.exists === "yes-conflict" ||
        record?.exists === "yes-conflict"
      ) {
        onConflict?.();
        return;
      }

      const { user } = extractAuthFromResponse(response);
      const redirectPath = getRedirectPath(user);

      if (redirectPath === "/auth/verify-email") {
        setPendingVerifyEmail(email);
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(email)}`,
        );
        return;
      }

      router.push(redirectPath);
    } catch (error) {
      if (isGoogleSignInCancelled(error)) return;
      toast.fromApiError(error, "Google sign-in failed. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={googleLoginMutation.isPending}
      className={cn(
        "flex h-[50px] w-[188px] items-center cursor-pointer justify-center gap-2 rounded-[15px] bg-[#F8F8F8] text-[14px] font-[500] text-[#181818] transition hover:bg-[#EFEFEF] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <img
        src="/asset/google.png"
        alt="Google"
        width={24}
        height={24}
        className="h-[24px] w-[24px] object-contain"
      />
      <span>{googleLoginMutation.isPending ? "Please wait..." : "Google"}</span>
    </button>
  );
}
