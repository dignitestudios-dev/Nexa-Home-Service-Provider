"use client";

import { useState } from "react";

import { useDeleteAccountMutation } from "@/hooks/user/use-delete-account-mutation";

import DeleteAccountDialog from "./_components/delete-account-dialog";

export default function DeleteAccountPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteAccountMutation = useDeleteAccountMutation();

  return (
    <div>
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">
        Delete Account
      </h2>

      <div className="mt-6 rounded-[12px] border border-[rgba(24,24,24,0.08)] bg-white px-6 py-6">
        <h3 className="text-[18px] font-[600] leading-[25px] text-[#1C1C1C]">
          Permanently Delete Your Account
        </h3>

        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="mt-6 cursor-pointer rounded-[12px] bg-[#FFF1F1] px-5 py-[0.8em] text-[14px] font-[600] leading-5 text-[#F01A1A] transition hover:bg-[#FFE4E4]"
        >
          Delete Account
        </button>
      </div>

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isConfirming={deleteAccountMutation.isPending}
        onConfirm={() => deleteAccountMutation.mutateAsync()}
      />
    </div>
  );
}
