"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateReportIssueMutation,
} from "@/hooks/report-issue/use-create-report-issue-mutation";
import { toast } from "@/lib/toast";

const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 500;

const ISSUE_TYPES = [
  "Technical Issue",
  "Account Problem",
  "Billing / Payment",
  "Job Related",
  "Other",
] as const;

type IssueType = (typeof ISSUE_TYPES)[number];

type FieldErrors = {
  title?: string;
  description?: string;
};

type AddReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function AddReportDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddReportDialogProps) {
  const createReportIssueMutation = useCreateReportIssueMutation();
  const [issueType, setIssueType] = useState<IssueType>("Technical Issue");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;

    setIssueType("Technical Issue");
    setSubject("");
    setDescription("");
    setErrors({});
    createReportIssueMutation.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();
    const nextErrors: FieldErrors = {};

    if (!trimmedSubject) {
      nextErrors.title = "Title is required.";
    } else if (trimmedSubject.length > MAX_TITLE_LENGTH) {
      nextErrors.title = `Title must be at most ${MAX_TITLE_LENGTH} characters.`;
    }

    if (!trimmedDescription) {
      nextErrors.description = "Description is required.";
    } else if (trimmedDescription.length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    } else if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      nextErrors.description = `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const payload = {
      title: trimmedSubject,
      description: trimmedDescription,
    };

    try {
      const response = await createReportIssueMutation.mutateAsync(payload);
      toast.fromApiSuccess(response, "Report submitted successfully.");
      onSuccess?.();
      onOpenChange(false);
    } catch {
      // Error toast is handled in the mutation hook.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[525px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] border-none p-0 shadow-xl"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">Add report</DialogTitle>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-[30px] top-5 flex h-10 w-10 items-center justify-center"
          aria-label="Close add report dialog"
        >
          <X className="h-5 w-5 text-[#181818]" strokeWidth={1.8} />
        </button>

        <form onSubmit={handleSubmit} className="px-10 pb-10 pt-8">
          <p className="text-[24px] font-bold capitalize leading-5 tracking-[-0.018em] text-[#1C1C1C]">
          Report an Issue          </p>

          <div className="mt-6">
            <label
              htmlFor="report-subject"
              className="text-[16px] font-[500] leading-5 text-[#1C1C1C]"
            >
              Title
            </label>
            <Input
              id="report-subject"
              type="text"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setErrors((current) => {
                  if (!current.title) return current;
                  const { title: _title, ...rest } = current;
                  return rest;
                });
              }}
              placeholder="Brief summary of the issue"
              maxLength={MAX_TITLE_LENGTH}
              aria-invalid={Boolean(errors.title)}
              className="mt-2 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] shadow-none placeholder:text-[rgba(24,24,24,0.6)] focus-visible:ring-0"
            />
            {errors.title ? (
              <p className="mt-1.5 text-[14px] text-[#F01A1A]" role="alert">
                {errors.title}
              </p>
            ) : null}
            <p className="mt-2 text-right text-[14px] text-black/50">
              {subject.length}/{MAX_TITLE_LENGTH}
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="report-description"
              className="text-[16px] font-[500] leading-5 text-[#1C1C1C]"
            >
              Description
            </label>
            <div className="mt-2 rounded-[12px] bg-[#F8F8F8] p-3">
              <textarea
                id="report-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrors((current) => {
                    if (!current.description) return current;
                    const { description: _description, ...rest } = current;
                    return rest;
                  });
                }}
                placeholder="Describe the issue in detail"
                maxLength={MAX_DESCRIPTION_LENGTH}
                aria-invalid={Boolean(errors.description)}
                className="h-[120px] w-full resize-none bg-transparent text-[16px] leading-5 text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] outline-none"
              />
            </div>
            {errors.description ? (
              <p className="mt-1.5 text-[14px] text-[#F01A1A]" role="alert">
                {errors.description}
              </p>
            ) : null}
            <p className="mt-2 text-right text-[14px] text-black/50">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>

          <Button
            type="submit"
            disabled={createReportIssueMutation.isPending}
            className="mt-6 h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-[600] leading-5 text-white hover:bg-[#004d57] disabled:opacity-60"
          >
            {createReportIssueMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddReportButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[8px] bg-[#005864] px-4 py-3 text-white transition hover:bg-[#004d57]"
    >
      <Plus className="h-[15px] w-[15px]" strokeWidth={2.2} />
      <span className="text-[16px] font-[600] capitalize leading-5">
        Add Report
      </span>
    </button>
  );
}
