"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";
import { useLogoutAuth } from "@/hooks/auth/use-auth-mutations";
import { LogOut } from "lucide-react";
import { toast } from "@/lib/toast";
import { getApiErrorMessage } from "@/lib/api-error";

type IdentityStatus =
  | "not-provided"
  | "pending"
  | "approved"
  | "rejected"
  | "resubmission"
  | "loading";

export default function IdentityVerificationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<IdentityStatus>("loading");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(3);
  const [isStarting, setIsStarting] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  
  const logoutMutation = useLogoutAuth();
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = async () => {
    setIsFetchingStatus(true);
    try {
      const response = await userService.getVerificationStatus();
      const data = response.data;
      if (data) {
        setStatus(data.identityStatus);
        setAttemptsRemaining(data.attemptsRemaining);

        // If approved, redirect to home dashboard immediately
        if (data.identityStatus === "approved") {
          router.replace("/home");
        }
      }
    } catch (error) {
      const msg = getApiErrorMessage(error, "Failed to load verification status.");
      if (msg) toast.error(msg);
      setStatus("not-provided");
    } finally {
      setIsFetchingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status === "pending") {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchStatus();
        }, 10000); // Poll every 10 seconds
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [status]);

  const handleStartVerification = async () => {
    try {
      setIsStarting(true);
      const response = await userService.startVerification();
      const sessionUrl = response.data?.sessionUrl;

      if (!sessionUrl) {
        throw new Error("Invalid session URL");
      }

      createVeriffFrame({
        url: sessionUrl,
        onEvent: (msg) => {
          if (msg === MESSAGES.FINISHED) {
            fetchStatus();
          }
        },
      });
    } catch (error) {
      const msg = getApiErrorMessage(error, "Could not start verification.");
      if (msg) toast.error(msg);
    } finally {
      setIsStarting(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#005864]" />
          <p className="text-[16px] text-gray-500">Loading your verification status...</p>
        </div>
      );
    }

    if (status === "approved") {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-green-100 px-6 py-3 text-green-700 flex items-center font-semibold text-lg">
            <span>✅ Identity Verified</span>
          </div>
          <p className="text-[16px] text-gray-600">
            Thank you! Your identity has been successfully verified. Redirecting to dashboard...
          </p>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-yellow-100 px-6 py-3 text-yellow-700 flex items-center font-semibold text-lg">
            <span>⏳ Under Review</span>
          </div>
          <p className="text-[16px] text-gray-600">
            Your identity verification is currently under review. This page will automatically update once the review is complete.
          </p>
        </div>
      );
    }

    if (status === "resubmission") {
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-6 w-full shadow-sm">
            <h3 className="text-orange-800 font-bold text-lg mb-2">Resubmission Requested</h3>
            <p className="text-[15px] text-orange-700">
              Please provide clearer ID photos or additional documents to complete your verification.
            </p>
          </div>
          <Button
            onClick={handleStartVerification}
            disabled={isStarting || isFetchingStatus}
            className="h-14 w-full max-w-[388px] rounded-full bg-[#005864] text-white hover:bg-[#004d57] font-[600] text-lg"
          >
            {isStarting || isFetchingStatus ? "Loading..." : "Retry Verification"}
          </Button>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 w-full shadow-sm">
            <h3 className="text-red-800 font-bold text-lg mb-2">Verification Declined</h3>
            <p className="text-[15px] text-red-700 mb-3">
              We were unable to verify your identity.
            </p>
            {attemptsRemaining > 0 ? (
              <p className="text-[15px] font-medium text-red-700 bg-red-100 py-1 px-3 rounded-full inline-block">
                You have {attemptsRemaining} attempt{attemptsRemaining > 1 ? "s" : ""} remaining.
              </p>
            ) : (
              <p className="text-[15px] font-bold text-red-700 bg-red-100 py-2 px-4 rounded-full inline-block">
                Maximum 3 attempts reached. Please contact support.
              </p>
            )}
          </div>
          
          {attemptsRemaining > 0 && (
            <Button
              onClick={handleStartVerification}
              disabled={isStarting || isFetchingStatus}
              className="h-14 w-full max-w-[388px] rounded-full bg-[#005864] text-white hover:bg-[#004d57] font-[600] text-lg"
            >
              {isStarting || isFetchingStatus ? "Loading..." : "Try Again"}
            </Button>
          )}
        </div>
      );
    }

    // "not-provided" or any unhandled state
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-[28px] font-bold text-gray-900">Identity Verification Required</h2>
        <p className="text-[16px] text-gray-600">
          You must verify your identity to access the dashboard and continue providing services on our platform.
        </p>
        <Button
          onClick={handleStartVerification}
          disabled={isStarting || isFetchingStatus}
          className="h-14 w-full max-w-[388px] rounded-full bg-[#005864] text-white hover:bg-[#004d57] font-[600] text-lg mt-2"
        >
          {isStarting || isFetchingStatus ? "Loading..." : "Verify Identity Now"}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6">
        <Button
          variant="outline"
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                router.replace("/auth/login");
              }
            });
          }}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-2 rounded-full font-medium"
        >
          <LogOut size={16} />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}
