export type UserStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "none" | "pending" | "confirmed" | "rejected";
export type VideoCategory =
  | "Tutorial"
  | "Tourism"
  | "Devotional"
  | "Entertainment"
  | "Education"
  | "Wellness";
export type PageName =
  | "landing"
  | "register"
  | "login"
  | "admin-login"
  | "dashboard"
  | "matrix"
  | "videos"
  | "pending"
  | "admin-dashboard"
  | "admin-users"
  | "admin-payments"
  | "admin-videos";

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  referralCode: string;
  referredBy: string | null;
  status: UserStatus;
  paymentStatus: PaymentStatus;
  utrNumber: string | null;
  joinedAt: string;
  commissionBalance: number;
  matrixLevel: number | null;
}

export interface Commission {
  id: string;
  toUserId: string;
  fromUserId: string;
  level: number;
  amount: number;
  date: string;
}

export interface Video {
  id: string;
  title: string;
  category: VideoCategory;
  url: string;
  thumbnail: string;
  description: string;
}
