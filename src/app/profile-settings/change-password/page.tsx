"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { PasswordUpdatedModal } from "@/app/profile-settings/_components/password-updated-modal";
import SettingsPasswordField from "@/app/profile-settings/_components/settings-password-field";
import { useChangePassword } from "@/hooks/auth/use-change-password-mutation";
import { getApiErrorMessage } from "@/lib/api-error";
import { changePasswordSchema } from "@/lib/schemas/auth.schema";
import { toast } from "@/lib/toast";

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const showValidationToast = (fieldErrors: FieldErrors<ChangePasswordFormData>) => {
    const message =
      fieldErrors.password?.message ||
      fieldErrors.newPassword?.message ||
      fieldErrors.confirmPassword?.message;

    if (message) {
      toast.error(message);
    }
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    setFormError(null);

    try {
      await changePasswordMutation.mutateAsync({
        password: data.password,
        newPassword: data.newPassword,
      });
      reset();
      setIsSuccessModalOpen(true);
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          "Could not change password. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[766px] flex-col">
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">
        Change Password
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit, showValidationToast)}
        className="mt-10 flex w-full max-w-[426px] flex-col gap-6"
      >
        <SettingsPasswordField
          id="current-password"
          label="Password"
          placeholder="Enter current password"
          error={errors.password?.message}
          registration={register("password")}
        />

        <p className="text-[16px] leading-[22px] tracking-[-0.0008em] text-[#3C3C3C]/60">
          You must enter current password in order to change password.
        </p>

        <SettingsPasswordField
          id="new-password"
          label="Password"
          placeholder="Enter new password"
          error={errors.newPassword?.message}
          registration={register("newPassword")}
        />

        <SettingsPasswordField
          id="confirm-password"
          label="Password"
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="h-12 w-full max-w-[388px] cursor-pointer rounded-[12px] bg-[#005864] px-[10px] py-3 text-[16px] font-[600] capitalize leading-5 text-white hover:bg-[#004d57] disabled:opacity-60"
          >
            {changePasswordMutation.isPending ? "Please wait..." : "Continue"}
          </Button>
        </div>

        {formError ? (
          <p className="text-center text-[14px] text-[#F01A1A]" role="alert">
            {formError}
          </p>
        ) : null}
      </form>

      <PasswordUpdatedModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
