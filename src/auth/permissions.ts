export function isAdmin(role?: string | null): boolean {
  return role === "admin";
}

export function isCandidate(role?: string | null): boolean {
  return role === "candidate";
}

export function canAccessAdminPortal(role?: string | null): boolean {
  return isAdmin(role);
}

export function canAccessCandidatePortal(role?: string | null): boolean {
  return isCandidate(role) || isAdmin(role);
}
