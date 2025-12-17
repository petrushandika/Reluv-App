import { User } from "@/features/(auth)/types";

/**
 * Get the appropriate redirect path based on user role
 */
export function getRoleBasedRedirect(user: User | null): string {
  if (!user) return "/";

  switch (user.role) {
    case "STORE":
      return "/store";
    case "ADMIN":
      return "/superadmin";
    case "USER":
    default:
      return "/";
  }
}

/**
 * Check if user can access a specific route based on their role
 */
export function canAccessRoute(user: User | null, path: string): boolean {
  if (!user) return false;

  // Store routes - only for STORE role
  if (path.startsWith("/store")) {
    return user.role === "STORE";
  }

  // Superadmin routes - only for ADMIN role
  if (path.startsWith("/superadmin")) {
    return user.role === "ADMIN";
  }

  // Main routes - only for USER role
  if (path.startsWith("/profile") || path.startsWith("/cart") || path.startsWith("/checkout")) {
    return user.role === "USER";
  }

  return true;
}
