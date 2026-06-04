import {
  BadgeCheck,
  Bell,
  CircleHelp,
  FileText,
  Lock,
  MapPin,
  Megaphone,
  Phone,
  ReceiptText,
  ShieldAlert,
  NotebookText,
  HandCoins,
  TriangleAlert,
  UserRoundX,
  type LucideIcon,
} from "lucide-react";

export type SettingsMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const settingsMenu: SettingsMenuItem[] = [
  {
    label: "Notifications",
    href: "/profile-settings/notifications",
    icon: Bell,
  },
  {
    label: "Service Plan",
    href: "/profile-settings/service-plan",
    icon: FileText,
  },
  {
    label: "Trusted Expert Badge",
    href: "/profile-settings/verified-badge-plan",
    icon: BadgeCheck,
  },
  {
    label: "Ad Promotion",
    href: "/profile-settings/ad-promotion",
    icon: Megaphone,
  },
  { label: "Addresses", href: "/profile-settings/addresses", icon: MapPin },
  {
    label: "Change Phone Number",
    href: "/profile-settings/change-phone-number",
    icon: Phone,
  },
  {
    label: "Transaction History",
    href: "/profile-settings/transaction-history",
    icon: ReceiptText,
  },
  {
    label: "Change Password",
    href: "/profile-settings/change-password",
    icon: Lock,
  },
  {
    label: "Terms and Conditions",
    href: "/profile-settings/terms-and-conditions",
    icon: CircleHelp,
  },
  {
    label: "Privacy Policy",
    href: "/profile-settings/privacy-policy",
    icon: ShieldAlert,
  },
  {
    label: "Refund Policy",
    href: "/profile-settings/refund-policy",
    icon: HandCoins,
  },
  {
    label: "Report an Issue",
    href: "/profile-settings/report-an-issue",
    icon: TriangleAlert,
  },
  {
    label: "Delete Account",
    href: "/profile-settings/delete-account",
    icon: UserRoundX,
  },
];
