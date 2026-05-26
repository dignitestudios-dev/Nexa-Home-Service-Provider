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
    label: "My Jobs",
    href: "/my-jobs",
    isActive: (pathname) =>
      pathname === "/my-jobs" || pathname.startsWith("/my-jobs/"),
  },
  {
    label: "Credit Plans",
    href: "/credit-plans",
    isActive: (pathname) =>
      pathname === "/credit-plans" || pathname.startsWith("/credit-plans/"),
  },
];
