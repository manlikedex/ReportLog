export type AppRole = "MODERATOR" | "ADMIN" | "MANAGEMENT" | "SENIOR" | null | undefined;

const ROLE_ORDER: Record<NonNullable<AppRole>, number> = {
  MODERATOR: 1,
  ADMIN: 2,
  SENIOR: 3,       // kept for compatibility with your schema
  MANAGEMENT: 4,
};

export function normalizeRole(role: any): AppRole {
  const r = String(role || "").toUpperCase();
  if (r === "MODERATOR" || r === "ADMIN" || r === "MANAGEMENT" || r === "SENIOR") return r;
  return null;
}

/** true if userRole is >= requiredRole */
export function hasAtLeastRole(userRole: any, requiredRole: any) {
  const u = normalizeRole(userRole);
  const req = normalizeRole(requiredRole);
  if (!u || !req) return false;
  return ROLE_ORDER[u] >= ROLE_ORDER[req];
}

/** Permission helpers */
export const PERMS = {
  canCreateCase: (role: any) => hasAtLeastRole(role, "MODERATOR"),
  canEditCase: (role: any) => hasAtLeastRole(role, "ADMIN"),
  canManageStaff: (role: any) => hasAtLeastRole(role, "MANAGEMENT"),
};
