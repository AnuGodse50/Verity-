"use client";

import type { ReactNode } from "react";
import type { Permission } from "@/lib/auth/permissions";
import { usePermission } from "./use-permission";

export function PermissionGate({ permission, children, fallback = null }: { permission: Permission; children: ReactNode; fallback?: ReactNode }) {
  return usePermission(permission) ? children : fallback;
}
