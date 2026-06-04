"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CircleX,
  Info,
  Lock,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";

import { useDeleteAccountMutation } from "@/hooks/user/use-delete-account-mutation";

import DeleteAccountDialog from "./delete-account-dialog";

const DELETE_CONSEQUENCES = [
  "Your profile, personal details, and preferences will be permanently deleted.",
  "All your credits will be lost.",
  "You won't be able to access your account or restore any data.",
] as const;

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#075C61] bg-[#fff] text-[#F01A1A]">
      {children}
    </span>
  );
}

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteAccountMutation = useDeleteAccountMutation();

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#181818] transition hover:bg-black/5"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <h2 className="text-[24px] font-[700] leading-[30px] text-[#1C1C1C]">
          Delete Account
        </h2>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[rgba(24,24,24,0.06)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="relative border-b border-[rgba(24,24,24,0.06)] px-6 py-6 md:px-8">
          <div className="relative z-[1] flex items-start gap-4 pr-24">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#005864] bg-[#fff]/10">
              <Trash2 className="h-5 w-5 text-[#005864]" strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[20px] font-[700] leading-[26px] text-[#1C1C1C]">
                Delete Your Account
              </h3>
              <p className="mt-1 max-w-[520px] text-[14px] font-[400] leading-[22px] text-[rgba(24,24,24,0.65)]">
                Once you delete your account, there&apos;s no going back. Please
                read the information below carefully.
              </p>
            </div>
          </div>

        
        </div>

        <div className="space-y-8 px-6 py-6 md:px-8 md:py-8">
          <section>
            <div className="flex items-start gap-3">
              <SectionIcon>
                <UserRound className="h-[18px] w-[18px] text-[#075C61]" strokeWidth={2} />
              </SectionIcon>
              <div className="min-w-0 flex-1">
                <h4 className="text-[16px] font-[700] leading-[22px] text-[#1C1C1C]">
                  What happens when you delete your account?
                </h4>
                <p className="mt-2 text-[14px] font-[400] leading-[22px] text-[rgba(24,24,24,0.7)]">
                  Deleting your account will remove all your personal data,
                  credits, and account information from the NexaHome Platform.
                </p>

                <div className="mt-4 rounded-[12px] bg-[#075C61]/10 px-4 py-4">
                  <ul className="space-y-3">
                    {DELETE_CONSEQUENCES.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[14px] leading-[22px] text-[rgba(24,24,24,0.75)]"
                      >
                        <CircleX
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#000]"
                          strokeWidth={2.2}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

         
        </div>

        <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-[rgba(24,24,24,0.08)] px-6 py-4 sm:flex-row sm:items-center md:px-8">
        
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#D91717]/10 px-6 text-[14px] font-[600] leading-5 text-[#D91717] transition hover:bg-[#d91717]"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.2} />
            Delete Account
          </button>
        </div>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 text-[13px] font-[400] leading-5 text-[rgba(24,24,24,0.45)]">
        <Lock className="h-3.5 w-3.5" strokeWidth={2} />
        Your security and privacy are important to us.
      </p>

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isConfirming={deleteAccountMutation.isPending}
        onConfirm={() => deleteAccountMutation.mutateAsync()}
      />
    </div>
  );
}
