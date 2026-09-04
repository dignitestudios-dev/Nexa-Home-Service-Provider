"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useAppleLoginAuth } from "@/hooks/auth/use-auth-mutations";
import { extractAuthFromResponse } from "@/lib/auth-session";
import { getRedirectPath } from "@/lib/auth-utils";
import { isAppleSignInCancelled } from "@/lib/firebase-apple-auth";
import { toast } from "@/lib/toast";
import { setPendingVerifyEmail } from "@/lib/verify-email-storage";
import { cn } from "@/lib/utils";

type AppleSignInButtonProps = {
  className?: string;
  onConflict?: () => void;
};

export function AppleSignInButton({
  className,
  onConflict,
}: AppleSignInButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appleLoginMutation = useAppleLoginAuth();

  const handleAppleSignIn = async () => {
    try {
      const { response, email } = await appleLoginMutation.mutateAsync();
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

      const redirectParam = searchParams.get("redirect");
      const redirectPath =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : getRedirectPath(user);

      if (redirectPath === "/auth/verify-email") {
        const targetEmail = email || user?.email || "";
        if (targetEmail) {
          setPendingVerifyEmail(targetEmail);
          router.push(
            `/auth/verify-email?email=${encodeURIComponent(targetEmail)}`,
          );
          return;
        }
      }

      router.push(redirectPath);
    } catch (error) {
      if (isAppleSignInCancelled(error)) return;
      toast.fromApiError(error, "Apple sign-in failed. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleAppleSignIn}
      disabled={appleLoginMutation.isPending}
      className={cn(
        "flex h-[50px] w-[188px] items-center cursor-pointer justify-center gap-2 rounded-[15px] bg-[#F8F8F8] text-[14px] font-[500] text-[#181818] transition hover:bg-[#EFEFEF] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <img
        src="/asset/apple.png"
        alt="Apple"
        width={24}
        height={24}
        className="h-[24px] w-[24px] object-contain"
      />
      <span>{appleLoginMutation.isPending ? "Please wait..." : "Apple"}</span>
    </button>
  );
}
