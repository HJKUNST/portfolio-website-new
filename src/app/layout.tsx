import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Crimson_Pro, Manrope } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/components/CursorProvider";
import { LoadingScreen } from "@/components/LoadingScreen";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laura HJ Kim | Portfolio",
  description:
    "Product Designer at the intersection of design, engineering, and finance.",
  icons: {
    icon: '/favicon.png', // Uses favicon.png from the public directory
  },
  openGraph: {
    title: "Laura HJ Kim | Portfolio",
    description: "Product Designer at the intersection of design, engineering, and finance.",
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Laura HJ Kim Portfolio Thumbnail',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Laura HJ Kim | Portfolio",
    description: "Product Designer at the intersection of design, engineering, and finance.",
    images: ['/thumbnail.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${crimsonPro.variable} antialiased overflow-x-hidden`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5X4DRLNPMF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5X4DRLNPMF');
          `}
        </Script>

        <LoadingScreen />
        <CursorProvider />
        {children}
      </body>
    </html>
  );
}
