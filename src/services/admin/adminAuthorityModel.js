export function isPlatformAdministrator(profile) {
  return profile?.role === "admin";
}
