import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Voyago Holidays — Travel With Your Tribe. See Real Demand Before You Book.",
  description:
    "Curated domestic and international holidays (₹10,000 – ₹5,00,000) matched by mindset cohorts, backed by our live Booking Heat Map, 3-step direct checkout, and < 2 hr human telephonic customization.",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/icon-192.png",
    apple: "/assets/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#132352",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-surface text-navy">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); }`,
          }}
        />
      </body>
    </html>
  );
}
