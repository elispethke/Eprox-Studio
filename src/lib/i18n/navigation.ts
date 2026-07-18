import { createNavigation } from "next-intl/navigation";
import { routing } from "@/lib/i18n/config";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
