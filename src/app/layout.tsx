import type { Metadata } from "next";
import { Crimson_Pro, Manrope } from "next/font/google";
import "./globals.css";

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
    "Portfolio experience for Laura HJ Kim — interfaces crafted with rhythm, craft, and clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${crimsonPro.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
