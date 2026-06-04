export type NotificationSettingItem = {
  id: string;
  title: string;
  enabled: boolean;
};

export type UserNotificationSettings = {
  notifications: NotificationSettingItem[];
};
