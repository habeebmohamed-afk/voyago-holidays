# Step-by-Step Public Deployment Guide (₹0 Free Tier)
**Stack:** GitHub (Code) → Supabase (Free Database & Customer Login) → Vercel (Free Public Hosting)

---

## Step 1: Upload This Project to Your GitHub Account (3 mins)
1. Unzip `voyago-holidays-nextjs-supabase.zip` on your computer.
2. Log in to [GitHub](https://github.com) and click **New Repository** (name it `voyago-holidays`).
3. Open your terminal inside the unzipped `voyago-holidays` folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial Voyago Holidays v1.0 full-stack launch"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/voyago-holidays.git
   git push -u origin main
   ```

---

## Step 2: Set Up Your Free Supabase Database & Customer Login (4 mins)
1. Sign up free at [Supabase](https://supabase.com) and click **New Project** (`voyago-holidays`).
2. In the left sidebar, open **SQL Editor → New Query**.
3. Open `supabase/schema.sql` from this project, copy the entire file, paste it into the Supabase SQL Editor, and click **Run**.
   * This creates all 10 tables (`profiles`, `packages`, `departures`, `bookings`, `customizations`, `id_verifications`, etc.), security policies, and the 8 launch packages.
4. In Supabase, go to **Project Settings → API** and copy these 3 values:
   * **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   * **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * **service_role key** (keep secret!) → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3: Publish Live on Vercel Free Tier (3 mins)
1. Go to [Vercel](https://vercel.com) and click **Continue with GitHub**.
2. Click **Add New → Project** and select your `voyago-holidays` repository.
3. Expand **Environment Variables** and paste the 3 Supabase keys from Step 2, plus:
   * `NEXT_PUBLIC_ENABLE_BOOKING_HEATMAP` = `true`
   * `PAYMENT_GATEWAY_PROVIDER` = `razorpay`
   * *(Optional when ready)* `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (from your free Razorpay Test Mode dashboard).
4. Click **Deploy**. In ~60 seconds, Vercel gives you a live public HTTPS link (e.g., `https://voyago-holidays.vercel.app`) that anyone in the world can open!

---

## Step 4: View Your Captured Customer Details Anytime
* Every time a visitor signs up as an **Individual (B2C)** or **Company (B2B)** to unlock itineraries, save trips, request a custom quote, or book a package, their name, email, phone number, company name, and GSTIN are saved automatically in **Supabase → Table Editor → `profiles`**.
* Every customization form submission appears in **`customizations`**, and every booking appears in **`bookings`**.

## Step 5: Connecting a Paid Custom Domain Later
Whenever you purchase a domain (such as `voyagoholidays.com`), open **Vercel → Project Settings → Domains**, type your domain, and update the 2 DNS records at your domain registrar—zero code changes required!
