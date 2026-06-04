export type AppNotification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationsResult = {
  notifications: AppNotification[];
};
