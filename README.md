# Voyago Holidays — Full-Stack Next.js + Supabase Web Application (v1.0)

> **Direct B2C & Corporate B2B Curated Travel Platform**  
> Travel With Your Tribe. See Real Demand Before You Book.  
> Headquartered in Rameshwaram, Tamil Nadu, India • *Note: Created for educational purposes only.*

## What's Inside
* **Public Storefront (Next.js 15 App Router + TypeScript + Tailwind CSS + Desktop PWA):**
  * **Homepage (`/`):** Above-the-fold quick-filter bar, 4-pillar Value Prop grid, Featured Packages, Interactive Booking Heat Map Spotlight, B2B Corporate Banner, How It Works, and Founder's Note preview.
  * **About Us & Founder (`/about`):** Featuring Founder **Habeeb Mohamed Easa Mohideen** (`public/assets/Founder.jpg`), his Rameshwaram-to-Kashmir self-drive & international travel story, and Voyago's traveler-first promise.
  * **Package Discovery (`/packages`):** Domestic/International scope, ₹10,000–₹5,00,000 dual budget slider, Mindset Cohorts, Trip Themes, sorting, removable chips, and zero-result customization pre-fill redirect.
  * **Package Detail (`/packages/[slug]`):** Feature-flagged (`NEXT_PUBLIC_ENABLE_BOOKING_HEATMAP`) Interactive Booking Heat Map (zero-PII, color-blind-safe tiers + tooltips), early-auth-gated Day-by-Day Itinerary accordion, inclusions/exclusions, policy tabs, and sticky booking card.
  * **Corporate & B2B Portal (`/corporate`):** Side-by-side 3-package comparison, 5%/8%/12% group discount slabs, 30%/70% milestone billing, and 2027 Corporate Lookbook lead capture.
  * **Telephonic Customization (`/customize`):** B2C/B2B request form with pre-fill, auth gate, and `< 2 business hours` callback confirmation (`#VH-CUST-XXXX`).
  * **3-Step Direct Checkout (`/checkout` & `/booking-confirmed`):** 15-minute atomic seat reservation timer, B2B GSTIN & International PAN regex validation, 5% GST + 5% Overseas TCS breakdown, automatic UPI ₹1,00,000 cap enforcement, Razorpay/PayU sandbox execution + Gateway Outage Fallback, downloadable PDF GST/TCS Tax Invoice, and 2-question post-checkout micro-survey.
  * **Role-Based Auth & Account Dashboard (`/login`, `/signup`, `/account`):** Individual (B2C) & Company (B2B) registration storing customer details in Supabase `profiles`, My Bookings, PDF Invoices, Saved Trips, 24-hr Cohort ID upload, B2B Employee Roster CSV upload, and India DPDP self-serve **Delete My Account**.
  * **Help Center (`/help`):** Searchable FAQ accordion + Ticket Desk, Toll-Free Phone (`1800-000-0000`), WhatsApp, and Email (`voyagoholidays.support@gmail.com`) — strictly **no AI chatbot**.
  * **Legal Starter Pages (`/legal/*`):** Terms of Service, India DPDP Privacy Policy, Cancellation & Refund Policy, International Visa & Insurance Disclaimer, and Traveler Code of Conduct.
* **Custom Internal Admin Panel (`/admin`):** RBAC-structured dashboard with Package/Departure CMS, Bookings & B2B NEFT Reconciliation + GST/TCS CSV export, 24-hr Cohort ID & B2B KYC Queue, and `< 2 hr` Customization Leads with Custom Payment Link Generator.
* **Backend API Routes (`/api/v1/*`) & Database (`supabase/schema.sql`):** Complete PostgreSQL schema, Row-Level Security (RLS) policies, auto-profile trigger, and pure-TypeScript PDF 1.4 GST/TCS invoice generation.

## Quick Local Run
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open `http://localhost:3000`. The app runs out of the box in **Interactive Sandbox Mode** even before you add Supabase keys—and switches automatically to live Supabase Auth & PostgreSQL once you add your `.env.local` values.

See **`DEPLOYMENT_GUIDE.md`** for step-by-step instructions to publish on **GitHub + Supabase (Free Tier) + Vercel (Free Tier)**.
