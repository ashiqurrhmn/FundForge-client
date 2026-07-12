// ============================================================
// Credit Packages — Single source of truth
// ============================================================

export interface CreditPackage {
  id: string;
  credits: number;
  price: number; // USD
  label: string;
  badge?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "credits_100",
    credits: 100,
    price: 10,
    label: "Starter",
  },
  {
    id: "credits_300",
    credits: 300,
    price: 25,
    label: "Popular",
    badge: "Most Popular",
  },
  {
    id: "credits_800",
    credits: 800,
    price: 60,
    label: "Pro",
  },
  {
    id: "credits_1500",
    credits: 1500,
    price: 110,
    label: "Ultimate",
    badge: "Best Value",
  },
];

// ============================================================
// Payment Intent
// ============================================================

export interface CreatePaymentIntentRequest {
  amount: number; // USD (dollars)
  credits: number;
  packageName: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}

// ============================================================
// Payment Record (MongoDB document)
// ============================================================

export interface PaymentRecord {
  _id?: string;
  userEmail: string;
  creditsPurchased: number;
  packageName: string;
  amountPaid: number; // USD
  transactionId: string;
  paymentMethod: string;
  paymentDate: string; // ISO string
  status: "succeeded" | "pending" | "failed";
}

// ============================================================
// User (extends better-auth user with credits)
// ============================================================

export interface FundForgeUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "creator" | "supporter";
  credits: number;
  createdAt: string;
  updatedAt: string;
}
