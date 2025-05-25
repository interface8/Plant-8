export function getUserInitials(name?: string): string {
  if (!name) return "U";
  const names = name.split(" ");
  return (names[0].charAt(0) + (names[1]?.charAt(0) || "")).toUpperCase();
}
