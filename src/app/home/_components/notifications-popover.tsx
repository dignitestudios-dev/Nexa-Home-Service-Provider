"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationCountQuery } from "@/hooks/notifications/use-notification-count-query";
import {
  useClearAllNotificationsMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/hooks/notifications/use-notification-mutations";
import { useNotificationsQuery } from "@/hooks/notifications/use-notifications-query";
import { formatNotificationTime } from "@/lib/parse-notifications-response";
import { getNotificationRoute } from "@/lib/notification-navigation";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notification.types";

function NotificationRow({
  notification,
  onRead,
  onDelete,
  onNavigate,
  isUpdating,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (route: string) => void;
  isUpdating: boolean;
}) {
  const { id, title, message, isRead, createdAt, metadata } = notification;
  const time = formatNotificationTime(createdAt);
  const route = getNotificationRoute(metadata);

  return (
    <div className="group relative min-h-[74px] border-b border-[#E4E4E4] py-0 pt-4 last:border-b-0">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => {
          if (!isRead) onRead(id);
          if (route) onNavigate(route);
        }}
        className={cn(
          "w-full text-left disabled:cursor-not-allowed",
          route ? "cursor-pointer" : "cursor-default",
        )}
      >
        <div className="flex items-start justify-between gap-4 pr-8">
          <p
            className={cn(
              "text-[13px] font-[700] leading-4",
              isRead ? "text-[#787F8C]" : "text-[#1C1C1C]",
            )}
          >
            {title}
          </p>
          {time ? (
            <span
              className={cn(
                "shrink-0 text-[12px] font-[500] leading-[15px]",
                isRead ? "text-[#717171]" : "text-black/80",
              )}
            >
              {time}
            </span>
          ) : null}
        </div>
        {message ? (
          <p
            className={cn(
              "mt-2 pr-6 text-[13px] leading-4",
              isRead ? "text-black/50" : "text-black/80",
            )}
          >
            {message}
          </p>
        ) : null}
      </button>

      {!isRead ? (
        <span className="absolute bottom-[14px] right-6 h-[8px] w-[8px] rounded-full bg-[#FF0000]" />
      ) : null}

      <button
        type="button"
        aria-label="Delete notification"
        disabled={isUpdating}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(id);
        }}
        className="absolute right-0 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#787F8C] opacity-0 transition hover:bg-[#F3F3F3] hover:text-[#1C1C1C] group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function NotificationsPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: count = 0 } = useNotificationCountQuery();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useNotificationsQuery(isOpen);

  const markAsReadMutation = useMarkNotificationReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsReadMutation();
  const clearAllMutation = useClearAllNotificationsMutation();
  const deleteMutation = useDeleteNotificationMutation();

  const notifications = data?.notifications ?? [];
  const deletingNotificationId =
    deleteMutation.isPending && deleteMutation.variables
      ? deleteMutation.variables
      : null;
  const isUpdating =
    markAsReadMutation.isPending ||
    markAllAsReadMutation.isPending ||
    clearAllMutation.isPending;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      void refetch();
    }
  };

  const handleNavigate = (route: string) => {
    setIsOpen(false);
    router.push(route);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#181818] transition hover:bg-[#EDEDED] data-[state=open]:bg-[#EDEDED]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {count > 0 ? (
            <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF0000] px-1 text-[11px] font-[500] leading-none text-white">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[470px] rounded-[8px] border-none bg-white p-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="px-[23px] pb-5 pt-[19px]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[16px] font-[600] leading-5 text-[#181818]">
              Notifications
            </h3>

            {notifications.length > 0 ? (
              <div className="flex items-center gap-3">
                {count > 0 ? (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={(event) => {
                      event.stopPropagation();
                      markAllAsReadMutation.mutate();
                    }}
                    className="cursor-pointer text-[12px] font-[500] text-[#005864] transition hover:text-[#00424a] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark all read
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={(event) => {
                    event.stopPropagation();
                    clearAllMutation.mutate();
                  }}
                  className="cursor-pointer text-[12px] font-[500] text-[#005864] transition hover:text-[#00424a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear all
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-[15px] flex max-h-[344px] flex-col overflow-y-auto pr-0">
            {isLoading ? (
              <p className="py-6 text-center text-[13px] text-black/50">
                Loading notifications...
              </p>
            ) : null}

            {isError ? (
              <p className="py-6 text-center text-[13px] text-[#F01A1A]">
                Unable to load notifications.
              </p>
            ) : null}

            {!isLoading && !isError && notifications.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-black/50">
                No notifications yet.
              </p>
            ) : null}

            {!isLoading && !isError
              ? notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    isUpdating={
                      isUpdating || deletingNotificationId === notification.id
                    }
                    onRead={(id) => markAsReadMutation.mutate(id)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onNavigate={handleNavigate}
                  />
                ))
              : null}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
