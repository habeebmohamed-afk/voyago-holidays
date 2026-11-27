import type { PackageScope } from "@/types";

export const UPI_TRANSACTION_CAP_INR = 100000;
export const GST_RATE = 0.05; // 5% Indian Tour Operator GST
export const INTL_TCS_RATE = 0.05; // 5% Overseas Tour Program Package TCS (base slab)

export interface PriceBreakdown {
  baseAmount: number;
  b2bDiscountRate: number;
  b2bDiscount: number;
  taxableAmount: number;
  gstAmount: number;
  tcsAmount: number;
  grandTotal: number;
  upiAllowed: boolean;
}

export function getB2bDiscountRate(
  customerType: "B2C" | "B2B",
  travelerCount: number
): number {
  if (customerType !== "B2B") return 0;
  if (travelerCount >= 51) return 0.12;
  if (travelerCount >= 26) return 0.08;
  if (travelerCount >= 10) return 0.05;
  return 0;
}

export function calculatePriceBreakdown(
  unitPriceInr: number,
  travelerCount: number,
  scope: PackageScope,
  customerType: "B2C" | "B2B"
): PriceBreakdown {
  const safeCount = Math.max(1, travelerCount);
  const baseAmount = Math.round(unitPriceInr * safeCount);
  const b2bDiscountRate = getB2bDiscountRate(customerType, safeCount);
  const b2bDiscount = Math.round(baseAmount * b2bDiscountRate);
  const taxableAmount = baseAmount - b2bDiscount;
  const gstAmount = Math.round(taxableAmount * GST_RATE);
  const tcsAmount =
    scope === "International"
      ? Math.round((taxableAmount + gstAmount) * INTL_TCS_RATE)
      : 0;
  const grandTotal = taxableAmount + gstAmount + tcsAmount;

  return {
    baseAmount,
    b2bDiscountRate,
    b2bDiscount,
    taxableAmount,
    gstAmount,
    tcsAmount,
    grandTotal,
    upiAllowed: grandTotal <= UPI_TRANSACTION_CAP_INR,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}

export function isValidGSTIN(gstin: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    gstin.trim().toUpperCase()
  );
}
