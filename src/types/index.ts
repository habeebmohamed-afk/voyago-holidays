export type UserRole = "B2C" | "B2B" | "SUPER_ADMIN" | "TRAVEL_OPS" | "FINANCE" | "SALES";

export type PackageScope = "Domestic" | "International";

export type MindsetCohort =
  | "Girls-only"
  | "Boys-only"
  | "Couple-friendly"
  | "Family-friendly"
  | "Bachelors-friendly";

export type TripTheme = "Staycation" | "Adventurous" | "Religious" | "Sightseeing";

export type HeatMapTier = "Low Demand" | "Active" | "Trending" | "Almost Full";

export interface ItineraryDay {
  day: number;
  title: string;
  stay: string;
  meals: string;
  transport: string;
  activities: string[];
}

export interface HeatMapDeparture {
  date: string; // YYYY-MM-DD
  bookedCount: number;
  totalSeats: number;
  spotsLeft: number;
  tier: HeatMapTier;
  coldStartLabel: string;
}

export interface TravelPackage {
  slug: string;
  title: string;
  location: string;
  scope: PackageScope;
  cohort: MindsetCohort;
  theme: TripTheme;
  duration: string;
  priceInr: number;
  heatMapSummary: string;
  bookedPreview: number;
  summary: string;
  gradient: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  visaNote?: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  gstin?: string;
  kycStatus?: "NOT_REQUIRED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
}

export interface TravelerDetail {
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
}

export interface BookingRecord {
  bookingRef: string;
  userId?: string;
  customerType: "B2C" | "B2B";
  packageSlug: string;
  packageTitle: string;
  scope: PackageScope;
  cohort: MindsetCohort;
  departureDate: string;
  travelerCount: number;
  travelers: TravelerDetail[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName?: string;
  gstin?: string;
  panNumber?: string;
  baseAmount: number;
  b2bDiscount: number;
  gstAmount: number;
  tcsAmount: number;
  grandTotal: number;
  paymentMethod: "CARD" | "NETBANKING" | "UPI" | "NEFT_RTGS" | "CALLBACK_FALLBACK";
  paymentStatus: "PENDING" | "PAID" | "PENDING_NEFT" | "FAILED" | "REFUNDED";
  bookingStatus:
    | "Confirmed"
    | "Reserved — Pending Bank Settlement"
    | "ID Verification Pending"
    | "Completed"
    | "Cancelled";
  createdAt: string;
}

export interface CustomizationLead {
  referenceCode: string;
  travelerType: "B2C" | "B2B";
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  destinations: string;
  travelDates: string;
  travelerCount: number;
  budgetRange: string;
  cohort?: string;
  theme?: string;
  notes?: string;
  status: "New Lead" | "Callback Completed" | "Payment Link Sent" | "Converted";
  slaMinutesLeft: number;
  paymentLinkUrl?: string;
  milestoneSplit?: string;
  createdAt: string;
}

export interface IdVerificationItem {
  id: string;
  bookingRef: string;
  travelerName: string;
  cohort: "Girls-only" | "Boys-only";
  docType: "Masked Aadhaar" | "Passport" | "Driving License";
  docReference: string;
  status: "Pending Review" | "Verified" | "Action Required";
  slaHoursLeft: number;
  submittedAt: string;
}
