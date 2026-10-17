export const roles = [
  "customer",
  "business_representative",
  "bank_operations",
  "compliance_analyst",
  "bank_compliance_manager",
  "auditor",
  "platform_super_admin",
] as const;

export type Role = (typeof roles)[number];

export function roleFromQuery(value: string | undefined): Role {
  return roles.includes(value as Role) ? (value as Role) : "customer";
}

export const roleLabels: Record<Role, string> = {
  customer: "Customer / Individual User",
  business_representative: "Business Representative",
  bank_operations: "Bank Operations Staff",
  compliance_analyst: "Human Reviewer / Compliance Analyst",
  bank_compliance_manager: "Bank Compliance Manager",
  auditor: "Auditor",
  platform_super_admin: "Platform Super Admin",
};

export const roleShortLabels: Record<Role, string> = {
  customer: "Customer",
  business_representative: "Business representative",
  bank_operations: "Bank operations",
  compliance_analyst: "Compliance analyst",
  bank_compliance_manager: "Compliance manager",
  auditor: "Auditor",
  platform_super_admin: "Platform admin",
};

export const permissionCatalog = [
  "profile:read", "profile:update",
  "kyc:create", "kyc:submit", "kyc:resubmit",
  "kyb:create", "kyb:submit",
  "consent:read", "consent:approve", "consent:reject", "consent:revoke",
  "request:create", "request:read",
  "case:read", "case:review", "case:assign", "case:escalate", "case:override", "case:appeal",
  "evidence:read", "evidence:request",
  "policy:read", "policy:configure", "policy:approve",
  "audit:read", "audit:export",
  "tenant:read", "tenant:manage",
  "user:manage", "role:manage", "provider:manage", "platform:manage",
] as const;

export type Permission = (typeof permissionCatalog)[number];

const customerPermissions: Permission[] = [
  "profile:read", "profile:update", "kyc:create", "kyc:submit", "kyc:resubmit",
  "consent:read", "consent:approve", "consent:reject", "consent:revoke",
  "request:read", "case:read", "case:appeal",
];

const businessPermissions: Permission[] = [
  "profile:read", "profile:update", "kyb:create", "kyb:submit", "kyc:resubmit",
  "consent:read", "consent:approve", "consent:reject", "consent:revoke",
  "request:read", "case:read", "case:appeal", "evidence:request",
];

const operationsPermissions: Permission[] = [
  "request:create", "request:read", "case:read", "case:escalate",
  "kyc:create", "kyb:create", "audit:read",
];

const analystPermissions: Permission[] = [
  "case:read", "case:review", "case:escalate", "case:appeal",
  "evidence:read", "evidence:request", "request:read", "policy:read", "audit:read",
];

const managerPermissions: Permission[] = [
  ...analystPermissions, "case:assign", "case:override", "policy:configure",
  "policy:approve", "audit:export", "user:manage",
];

const auditorPermissions: Permission[] = ["case:read", "policy:read", "audit:read", "audit:export"];

const superAdminPermissions: Permission[] = [
  "audit:read", "audit:export", "tenant:read", "tenant:manage", "user:manage",
  "role:manage", "provider:manage", "platform:manage", "policy:read",
];

export const permissionsByRole: Record<Role, readonly Permission[]> = {
  customer: customerPermissions,
  business_representative: businessPermissions,
  bank_operations: operationsPermissions,
  compliance_analyst: analystPermissions,
  bank_compliance_manager: managerPermissions,
  auditor: auditorPermissions,
  platform_super_admin: superAdminPermissions,
};

export function effectivePermissions(assignedRoles: readonly Role[]): Permission[] {
  return [...new Set(assignedRoles.flatMap((role) => permissionsByRole[role] ?? []))];
}

export function hasPermission(assignedRoles: readonly Role[], permission: Permission): boolean {
  return assignedRoles.some((role) => permissionsByRole[role]?.includes(permission));
}

export const homeByRole: Record<Role, string> = {
  customer: "/customer",
  business_representative: "/business",
  bank_operations: "/bank",
  compliance_analyst: "/compliance",
  bank_compliance_manager: "/compliance/manager",
  auditor: "/audit",
  platform_super_admin: "/platform-admin",
};
