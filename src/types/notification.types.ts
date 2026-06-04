export type NotificationMetadata = {
  type: string;
  resourceId: string | null;
  cta: string | null;
  settingKey: string | null;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata: NotificationMetadata | null;
};

export type NotificationsResult = {
  notifications: AppNotification[];
};
