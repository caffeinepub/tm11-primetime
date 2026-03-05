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
  | "wallet"
  | "admin-dashboard"
  | "admin-users"
  | "admin-payments"
  | "admin-videos"
  | "admin-withdrawals";

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
  walletBalance: number;
  matrixLevel: number | null;
}

export type WithdrawalStatus = "pending" | "approved" | "rejected";

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  upiId: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
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
