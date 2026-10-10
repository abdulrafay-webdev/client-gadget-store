import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number): string {
  if (isNaN(amount)) return "Rs. 0";
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function calculateDiscountPercent(regularPrice: number, discountPrice?: number | null): number {
  if (!discountPrice || discountPrice >= regularPrice || regularPrice <= 0) return 0;
  return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
}

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Abbottabad",
  "Mardan",
  "Larkana",
  "Sheikhupura",
  "Rahim Yar Khan",
  "Gujrat",
  "Jhelum",
  "Sahiwal",
  "Wah Cantt",
  "Other"
];
