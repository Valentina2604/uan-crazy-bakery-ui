import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return '';
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean);
  if (initials.length > 1) {
    return `${initials[0]}${initials[initials.length - 1]}`.toUpperCase();
  }
  return (initials[0] || '').toUpperCase();
}
