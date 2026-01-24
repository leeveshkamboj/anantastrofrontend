import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/Provider";
import { Toaster } from "@/components/ui/sonner";
import { ProfileChecker } from "@/components/ProfileChecker";
import { ConditionalLayout } from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnantAstro - Astrological Consultations & AI Reports",
  description: "Get accurate kundli generation, personalized horoscopes, AI-powered reports, and expert astrological consultations with AnantAstro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ProfileChecker />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
