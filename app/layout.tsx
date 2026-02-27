/* app/layout.tsx */
import type { Metadata } from "next";
import { Lexend } from "next/font/google"; 
import "./globals.css";

// 1. เพิ่ม latin-ext เพื่อรองรับอักขระพิเศษที่กว้างขึ้น
const lexend = Lexend({
  subsets: ["latin", "latin-ext"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
  display: 'swap', // ช่วยให้ข้อความแสดงผลทันทีด้วย font สำรองระหว่างรอ Lexend โหลด
});

export const metadata: Metadata = {
  title: "KU FOOD COURT",
  description: "KU FOOD COURT Digital Credit System", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. ใช้ lexend.className ร่วมกับ variable เพื่อความชัวร์ว่าฟอนต์จะติดทุกที่ครับ */}
      <body
        className={`${lexend.variable} ${lexend.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}