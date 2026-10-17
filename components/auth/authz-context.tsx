"use client";

import { createContext, useContext } from "react";
import type { Permission, Role } from "@/lib/auth/permissions";

export type PortalSession = {
  roles: Role[];
  permissions: Permission[];
  tenantId: string | null;
  mfaVerified: boolean;
};

export const AuthzContext = createContext<PortalSession | null>(null);

export function useAuthz() {
  const value = useContext(AuthzContext);
  if (!value) throw new Error("useAuthz must be used inside PortalShell.");
  return value;
}
