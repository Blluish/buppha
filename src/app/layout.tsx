import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buppha - เครื่องประดับลวดลายดอกไม้",
  description: "เครื่องประดับลวดลายดอกไม้สุดหรู ออกแบบด้วยแรงบันดาลใจจากธรรมชาติ สร้างสรรค์ด้วยความประณีตในทุกชิ้นงาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
