"use client";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LegalDocument } from "@/lib/legal-content";

type LegalDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  document: LegalDocument;
};

export function LegalDocumentModal({
  open,
  onClose,
  document,
}: LegalDocumentModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100vh-2rem)] w-[640px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[24px] border-0 bg-white p-0"
      >
        <div className="relative shrink-0 border-b border-black/10 px-6 pb-4 pt-6 pr-16">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          <DialogTitle className="text-[24px] font-semibold leading-[30px] text-[#1C1C1C]">
            {document.title}
          </DialogTitle>
          <p className="mt-1 text-[14px] leading-5 text-black/60">
            Last updated: {document.lastUpdated}
          </p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <p className="text-[16px] leading-7 text-[#565656]">{document.intro}</p>

          <div className="mt-5 space-y-5">
            {document.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-[18px] font-semibold leading-6 text-[#181818]">
                  {section.heading}
                </h3>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-[16px] leading-7 text-[#565656]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
