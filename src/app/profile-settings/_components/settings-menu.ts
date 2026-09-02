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
} from "lucide-react";
import type { ComponentType } from "react";

export type LucideIcon = ComponentType<any>;

export type SettingsMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const settingsMenu: SettingsMenuItem[] = [
  {
    label: "Notifications",
    href: "/profile-settings/notifications",
    icon: Bell,
  },
  {
    label: "Advanced Category Plan",
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
    disabled: true,
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
    href: "https://www.nexahomeapp.com/experts/terms-and-conditions",
    icon: CircleHelp,
  },
  {
    label: "Privacy Policy",
    href: "https://www.nexahomeapp.com/experts/privacy-policy",
    icon: ShieldAlert,
  },
  {
    label: "Refund Policy",
    href: "https://www.nexahomeapp.com/experts/refund-policy",
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
