"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/lib/toast";
import { notificationService } from "@/services/notification.service";
import type { AppNotification } from "@/types/notification.types";

import { NOTIFICATIONS_COUNT_QUERY_KEY } from "./use-notification-count-query";
import { NOTIFICATIONS_QUERY_KEY } from "./use-notifications-query";

function invalidateNotificationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
  void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_COUNT_QUERY_KEY });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_COUNT_QUERY_KEY });

      const previousNotifications = queryClient.getQueryData<{
        notifications: AppNotification[];
      }>(NOTIFICATIONS_QUERY_KEY);
      const previousCount = queryClient.getQueryData<number>(
        NOTIFICATIONS_COUNT_QUERY_KEY,
      );

      queryClient.setQueryData<{ notifications: AppNotification[] }>(
        NOTIFICATIONS_QUERY_KEY,
        (current) => {
          if (!current) return current;

          return {
            notifications: current.notifications.map((item) =>
              item.id === notificationId ? { ...item, isRead: true } : item,
            ),
          };
        },
      );

      queryClient.setQueryData<number>(NOTIFICATIONS_COUNT_QUERY_KEY, (current) =>
        Math.max(0, (current ?? 0) - 1),
      );

      return { previousNotifications, previousCount };
    },
    onError: (error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICATIONS_COUNT_QUERY_KEY,
          context.previousCount,
        );
      }
      toast.fromApiError(error, "Unable to mark notification as read.");
    },
    onSettled: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_COUNT_QUERY_KEY });

      const previousNotifications = queryClient.getQueryData<{
        notifications: AppNotification[];
      }>(NOTIFICATIONS_QUERY_KEY);
      const previousCount = queryClient.getQueryData<number>(
        NOTIFICATIONS_COUNT_QUERY_KEY,
      );

      queryClient.setQueryData<{ notifications: AppNotification[] }>(
        NOTIFICATIONS_QUERY_KEY,
        (current) => {
          if (!current) return current;

          return {
            notifications: current.notifications.map((item) => ({
              ...item,
              isRead: true,
            })),
          };
        },
      );

      queryClient.setQueryData<number>(NOTIFICATIONS_COUNT_QUERY_KEY, 0);

      return { previousNotifications, previousCount };
    },
    onError: (error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICATIONS_COUNT_QUERY_KEY,
          context.previousCount,
        );
      }
      toast.fromApiError(error, "Unable to mark all notifications as read.");
    },
    onSettled: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
}

export function useClearAllNotificationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.clearAll(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_COUNT_QUERY_KEY });

      const previousNotifications = queryClient.getQueryData<{
        notifications: AppNotification[];
      }>(NOTIFICATIONS_QUERY_KEY);
      const previousCount = queryClient.getQueryData<number>(
        NOTIFICATIONS_COUNT_QUERY_KEY,
      );

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, { notifications: [] });
      queryClient.setQueryData(NOTIFICATIONS_COUNT_QUERY_KEY, 0);

      return { previousNotifications, previousCount };
    },
    onError: (error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICATIONS_COUNT_QUERY_KEY,
          context.previousCount,
        );
      }
      toast.fromApiError(error, "Unable to clear notifications.");
    },
    onSettled: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_COUNT_QUERY_KEY });

      const previousNotifications = queryClient.getQueryData<{
        notifications: AppNotification[];
      }>(NOTIFICATIONS_QUERY_KEY);
      const previousCount = queryClient.getQueryData<number>(
        NOTIFICATIONS_COUNT_QUERY_KEY,
      );

      const deletedNotification = previousNotifications?.notifications.find(
        (item) => item.id === notificationId,
      );

      queryClient.setQueryData<{ notifications: AppNotification[] }>(
        NOTIFICATIONS_QUERY_KEY,
        (current) => {
          if (!current) return current;

          return {
            notifications: current.notifications.filter(
              (item) => item.id !== notificationId,
            ),
          };
        },
      );

      if (deletedNotification && !deletedNotification.isRead) {
        queryClient.setQueryData<number>(NOTIFICATIONS_COUNT_QUERY_KEY, (current) =>
          Math.max(0, (current ?? 0) - 1),
        );
      }

      return { previousNotifications, previousCount };
    },
    onError: (error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_QUERY_KEY,
          context.previousNotifications,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICATIONS_COUNT_QUERY_KEY,
          context.previousCount,
        );
      }
      toast.fromApiError(error, "Unable to delete notification.");
    },
    onSettled: () => {
      invalidateNotificationQueries(queryClient);
    },
  });
}
