"use client";

import { useToggleSettingsMutation } from "@/hooks/settings/use-toggle-settings-mutation";
import { useSettingsQuery } from "@/hooks/settings/use-settings-query";
import { NOTIFICATION_SETTING_DEFINITIONS } from "@/lib/notification-settings";
import type { NotificationSettingItem } from "@/types/settings.types";

const defaultNotifications: NotificationSettingItem[] =
  NOTIFICATION_SETTING_DEFINITIONS.map((definition) => ({
    id: definition.id,
    title: definition.title,
    enabled: true,
  }));

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`flex h-6 w-[42px] shrink-0 items-center rounded-full p-1 transition ${
        enabled ? "bg-[#005864]" : "bg-[#E6E6E6]"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition ${
          enabled ? "translate-x-[18px]" : ""
        }`}
      />
    </span>
  );
}

function NotificationSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-[12px] bg-white px-4 py-3"
        >
          <div className="h-5 w-48 animate-pulse rounded-md bg-[#E8E8E8]" />
          <div className="h-6 w-[42px] animate-pulse rounded-full bg-[#E8E8E8]" />
        </div>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const { data, isLoading, isPending, isFetching, isFetched, isError, refetch } =
    useSettingsQuery();
  const toggleSettingsMutation = useToggleSettingsMutation();

  const notifications = data?.notifications ?? defaultNotifications;
  const pendingToggleId =
    toggleSettingsMutation.isPending && toggleSettingsMutation.variables
      ? toggleSettingsMutation.variables.id
      : null;

  const showSkeleton =
    isLoading || isPending || (isFetching && !isFetched);

  const toggleNotification = (id: string) => {
    const item = notifications.find((notification) => notification.id === id);
    if (!item) return;

    toggleSettingsMutation.mutate({
      id,
      enabled: !item.enabled,
    });
  };

  return (
    <div>
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">
        Notifications
      </h2>

      {showSkeleton ? <NotificationSkeleton /> : null}

      {!showSkeleton && isError ? (
        <div className="mt-6 rounded-[12px] bg-white px-4 py-4">
          <p className="text-[16px] leading-[22px] text-[rgba(24,24,24,0.8)]">
            Unable to load notification settings.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 cursor-pointer text-[16px] font-[600] leading-5 text-[#005864] underline"
          >
            Try again
          </button>
        </div>
      ) : null}

      {!showSkeleton && !isError ? (
        <div className="mt-6 space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-[12px] bg-white px-4 py-3"
            >
              <p className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
                {item.title}
              </p>
              <button
                type="button"
                aria-label={`Toggle ${item.title}`}
                onClick={() => toggleNotification(item.id)}
                disabled={pendingToggleId === item.id}
                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Toggle enabled={item.enabled} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
