export type MainNavItem = {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {
    label: "Home",
    href: "/home",
    isActive: (pathname) => pathname === "/home",
  },
  {
    label: "Jobs",
    href: "/home",
    isActive: (pathname) =>
      pathname === "/jobs" || pathname.startsWith("/jobs/"),
  },
  {
    label: "Credit Plans",
    href: "/home",
    isActive: (pathname) =>
      pathname === "/credit-plans" || pathname.startsWith("/credit-plans/"),
  },
];
