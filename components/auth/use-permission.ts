"use client";

import type { Permission } from "@/lib/auth/permissions";
import { useAuthz } from "./authz-context";

export function usePermission(permission: Permission) {
  return useAuthz().permissions.includes(permission);
}
