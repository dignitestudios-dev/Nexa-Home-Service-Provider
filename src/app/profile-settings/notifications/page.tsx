"use client";

import { useState } from "react";

const initialNotifications = [
  { id: "promotional", title: "Promotional notifications", enabled: true },
  { id: "nearby", title: "Nearby job alerts", enabled: false },
  { id: "new-lead", title: "New lead updates", enabled: true },
  { id: "lead-expiry", title: "Lead expiry reminders", enabled: false },
  { id: "payment", title: "Payment confirmation alerts", enabled: true },
  { id: "renewal", title: "Plan renewal reminders", enabled: false },
  { id: "referral", title: "Referral updates", enabled: true },
  { id: "profile", title: "Profile completion reminders", enabled: false },
];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`flex h-6 w-[42px] items-center rounded-full p-1 transition ${
        enabled ? "bg-[#005864]" : "bg-[#E6E6E6]"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-[18px]" : ""}`}
      />
    </span>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotification = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <div>
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">Notifications</h2>

      <div className="mt-6 space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-[12px] bg-white px-4 py-3"
          >
            <p className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">{item.title}</p>
            <button
              type="button"
              aria-label={`Toggle ${item.title}`}
              onClick={() => toggleNotification(item.id)}
              className="cursor-pointer"
            >
              <Toggle enabled={item.enabled} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
