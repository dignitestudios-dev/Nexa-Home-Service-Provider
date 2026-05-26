"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Phone, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import JobPurchasedSuccessModal from "@/components/jobs/job-purchased-success-modal";
import PurchaseJobModal from "@/components/jobs/purchase-job-modal";
import { useApplyJobMutation } from "@/hooks/jobs/use-apply-job-mutation";
import { useProviderDashboardQuery } from "@/hooks/wallet/use-provider-dashboard-query";
import { toast } from "@/lib/toast";
import {
  cleanJobDescription,
  formatJobType,
  formatJobWhen,
} from "@/lib/parse-provider-feed";
import {
  formatContactPreferences,
  formatJobStatus,
  formatPostedDate,
  getClientDisplay,
  getClientInitials,
} from "@/lib/parse-job-detail";
import type { JobDetail, JobDetailAttachment } from "@/types/job-detail.types";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[16px] leading-6 text-[rgba(24,24,24,0.8)]">{label}</span>
      <span className="text-right text-[16px] font-medium leading-6 text-[#005864]">
        {value}
      </span>
    </div>
  );
}

type JobDetailViewProps = {
  job: JobDetail;
  backHref: string;
  showPurchaseButton?: boolean;
};

export default function JobDetailView({
  job,
  backHref,
  showPurchaseButton = true,
}: JobDetailViewProps) {
  const [previewAttachment, setPreviewAttachment] =
    useState<JobDetailAttachment | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { data: dashboardData } = useProviderDashboardQuery();
  const applyJobMutation = useApplyJobMutation();
  const canPurchase =
    showPurchaseButton &&
    !job.hasApplied &&
    job.jobProviderStatus.toLowerCase() !== "applied";
  const client = getClientDisplay(job);
  const description = cleanJobDescription(job.description);
  const attachmentCount = Math.max(job.attachments.length, 0);

  const mapUrl =
    job.address.coordinates &&
    `https://www.google.com/maps/search/?api=1&query=${job.address.coordinates[1]},${job.address.coordinates[0]}`;

  return (
    <div className="mx-auto w-full max-w-[1470px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="flex h-12 w-12 shrink-0 items-center justify-center p-3"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-[rgba(24,24,24,0.8)]" strokeWidth={2} />
          </Link>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#1C1C1C]">
            Job Detail
          </h1>
        </div>

        {job.badge ? (
          <span className="flex h-[52px] items-center justify-center rounded-full bg-[#2F80ED] px-5 text-[16px] font-semibold capitalize leading-5 text-white">
            {job.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-stretch">
        <div className="flex w-full max-w-[900px] flex-col gap-6">
          <section className="rounded-[18px] bg-[#F8F8F8] p-6">
            <h2 className="text-[24px] font-bold capitalize leading-[22px] text-[#1C1C1C]">
              {job.categoryName}
            </h2>
            <p className="mt-[10px] whitespace-pre-wrap break-words text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
              {description || "No description provided."}
            </p>
          </section>

          <section className="rounded-[12px] bg-[#F8F8F8] px-6 py-6">
            <div className="flex flex-col gap-3">
              <InfoRow label="Posted Date:" value={formatPostedDate(job.postedDate)} />
              <InfoRow
                label="Status:"
                value={formatJobStatus(job.status, job.jobProviderStatus)}
              />
              <InfoRow label="Job Type:" value={formatJobType(job.type)} />
              <InfoRow
                label="Contact Preferences:"
                value={formatContactPreferences(job.contactPreferences)}
              />
            </div>
          </section>

          {attachmentCount > 0 ? (
            <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-6">
              <h3 className="text-[16px] font-semibold capitalize leading-[22px] text-[#1C1C1C]">
                Attachment
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.attachments.map((attachment, index) => (
                  <button
                    key={attachment.id}
                    type="button"
                    disabled={!attachment.url}
                    onClick={() => attachment.url && setPreviewAttachment(attachment)}
                    className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[12px] bg-[rgba(0,88,100,0.12)] disabled:cursor-default enabled:cursor-pointer enabled:hover:opacity-90"
                    aria-label={`Open attachment ${index + 1}`}
                  >
                    {attachment.url ? (
                      attachment.isVideo ? (
                        <>
                          <video
                            src={attachment.url}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute left-1/2 top-1/2 flex h-[23px] w-[23px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(24,24,24,0.7)]">
                            <Play className="ml-0.5 h-2.5 w-2.5 fill-white text-white" />
                          </div>
                        </>
                      ) : (
                        <Image
                          src={attachment.url}
                          alt={`Attachment ${index + 1}`}
                          width={70}
                          height={70}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      )
                    ) : attachment.isVideo ? (
                      <div className="absolute left-1/2 top-1/2 flex h-[23px] w-[23px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(24,24,24,0.7)]">
                        <Play className="ml-0.5 h-2.5 w-2.5 fill-white text-white" />
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-6">
            <h3 className="text-[16px] font-semibold capitalize leading-[22px] text-[#1C1C1C]">
              Location
            </h3>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[16px] font-medium capitalize leading-5 text-[#1C1C1C]">
                  {job.address.label}
                </p>
                <p className="mt-2 max-w-[413px] break-words text-[16px] leading-5 text-[rgba(24,24,24,0.8)]">
                  {[job.address.address, job.address.city, job.address.state, job.address.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              {mapUrl ? (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[42px] shrink-0 items-center justify-center rounded-[6px] bg-[#005864] px-[15px] text-[16px] font-medium leading-5 text-white"
                >
                  View on map
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="h-[42px] shrink-0 cursor-not-allowed rounded-[6px] bg-[#005864]/50 px-[15px] text-[16px] font-medium leading-5 text-white"
                >
                  View on map
                </button>
              )}
            </div>
          </section>


        </div>

        <div className="flex w-full max-w-[508px] flex-col self-stretch">
          <aside className="rounded-[18px] bg-[#F8F8F8] px-[30px] pb-8 pt-6">
            <h3 className="text-center text-[20px] font-bold capitalize leading-[22px] text-[#181818]">
              Client Profile
            </h3>

            {job.client.profilePicture ? (
              <Image
                src={job.client.profilePicture}
                alt={client.name}
                width={140}
                height={140}
                className="mx-auto mt-6 h-[140px] w-[140px] rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="mx-auto mt-6 flex h-[140px] w-[140px] items-center justify-center rounded-full bg-[#005864] text-[40px] font-bold text-white">
                {getClientInitials(client.name)}
              </div>
            )}

            <p className="mt-5 text-center text-[24px] font-bold capitalize leading-[22px] text-black">
              {client.name}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-[12px] bg-[rgba(0,88,100,0.06)] px-5 py-4">
                <div>
                  <p className="text-[16px] font-semibold capitalize leading-5 text-[#005864]">
                    Phone Number
                  </p>
                  <p className="mt-1 text-[16px] capitalize leading-5 text-[rgba(24,24,24,0.8)]">
                    {client.phone}
                  </p>
                </div>
                <Phone className="h-6 w-6 text-[rgba(24,24,24,0.8)]" strokeWidth={1.5} />
              </div>

              <div className="flex items-center justify-between rounded-[12px] bg-[rgba(0,88,100,0.06)] px-5 py-4">
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold capitalize leading-5 text-[#005864]">
                    Email
                  </p>
                  <p className="mt-1 break-all text-[16px] leading-5 text-[rgba(24,24,24,0.8)]">
                    {client.email}
                  </p>
                </div>
                <Mail className="h-6 w-6 shrink-0 text-[rgba(24,24,24,0.8)]" strokeWidth={1.5} />
              </div>
            </div>
          </aside>

          {canPurchase ? (
            <button
              type="button"
              onClick={() => setIsPurchaseModalOpen(true)}
              className="mt-6 h-12 w-full shrink-0 rounded-[12px] bg-[#005864] text-[16px] font-semibold capitalize leading-5 text-white xl:mt-auto"
            >
              Purchase Job
            </button>
          ) : null}
        </div>

      </div>

      <PurchaseJobModal
        open={isPurchaseModalOpen}
        onOpenChange={setIsPurchaseModalOpen}
        job={job}
        remainingCredits={dashboardData?.availableCredits ?? 0}
        isConfirming={applyJobMutation.isPending}
        onConfirm={() => {
          applyJobMutation.mutate(job.id, {
            onSuccess: () => {
              setIsPurchaseModalOpen(false);
              setIsSuccessModalOpen(true);
            },
            onError: (error) => {
              toast.fromApiError(error, "Failed to purchase job. Please try again.");
            },
          });
        }}
      />

      <JobPurchasedSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <Dialog
        open={Boolean(previewAttachment)}
        onOpenChange={(open) => !open && setPreviewAttachment(null)}
      >
        <DialogContent className="max-w-[min(960px,95vw)] border-none bg-black/95 p-2 sm:p-4">
          <DialogTitle className="sr-only">Attachment preview</DialogTitle>
          {previewAttachment?.url ? (
            previewAttachment.isVideo ? (
              <video
                src={previewAttachment.url}
                controls
                autoPlay
                className="mx-auto max-h-[80vh] w-full rounded-[12px] object-contain"
              />
            ) : (
              <Image
                src={previewAttachment.url}
                alt="Attachment preview"
                width={1200}
                height={800}
                className="mx-auto max-h-[80vh] w-auto max-w-full rounded-[12px] object-contain"
                unoptimized
              />
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
