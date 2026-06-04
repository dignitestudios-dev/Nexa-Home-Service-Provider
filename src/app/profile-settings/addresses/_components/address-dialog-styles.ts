export const addressDialogContentClass =
  "max-h-[min(88vh,640px)] max-w-[min(440px,calc(100vw-1.5rem))] gap-0 overflow-x-hidden overflow-y-auto rounded-[12px] border-0 bg-white p-5 sm:p-6";

export const addressDialogTitleClass =
  "text-[20px] font-[700] leading-6 tracking-[-0.018em] text-[#181818]";

export const addressDialogFormClass = "mt-1 space-y-2.5";

export const addressFieldLabelClass =
  "mb-1 block text-[12px] font-[500] leading-4 text-[#181818]";

export const addressFieldInputClass =
  "h-10 rounded-[10px] border-[#005864] px-3 text-[13px]";

export const addressFieldInputMutedClass = `${addressFieldInputClass} bg-[#F8F8F8]`;

export const addressFieldInputWhiteClass = `${addressFieldInputClass} bg-white`;

export const addressDialogSubmitClass =
  "h-10 w-full cursor-pointer rounded-[10px] bg-[#005864] text-[14px] font-[600] text-white hover:bg-[#004d57]";

function isGooglePlacesPacContainerEvent(event: Event): boolean {
  const originalTarget =
    "detail" in event &&
    typeof event.detail === "object" &&
    event.detail !== null &&
    "originalEvent" in event.detail &&
    event.detail.originalEvent instanceof Event
      ? event.detail.originalEvent.target
      : null;

  return [event.target, originalTarget].some(
    (target) => target instanceof Element && Boolean(target.closest(".pac-container")),
  );
}

/** Radix dialog blocks outside clicks; allow Google Places suggestion dropdown. */
export const addressDialogOutsideEventHandlers = {
  onPointerDownOutside: (event: Event) => {
    if (isGooglePlacesPacContainerEvent(event)) {
      event.preventDefault();
    }
  },
  onInteractOutside: (event: Event) => {
    if (isGooglePlacesPacContainerEvent(event)) {
      event.preventDefault();
    }
  },
  onFocusOutside: (event: Event) => {
    if (isGooglePlacesPacContainerEvent(event)) {
      event.preventDefault();
    }
  },
};
