import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "한국전력공사 전력관리처 생성형 AI 학습동아리",
  description: "한국전력공사 전력관리처 생성형 AI 학습동아리 커뮤니티 플랫폼",
  keywords: ["AI", "학습동아리", "생성형 AI", "커뮤니티", "한국전력공사", "한전", "전력관리처"],
  authors: [{ name: "KEPCO Power Management AI Study Club" }],
  creator: "KEPCO Power Management AI Study Club",
  openGraph: {
    title: "한국전력공사 전력관리처 생성형 AI 학습동아리",
    description: "한국전력공사 전력관리처 생성형 AI 학습동아리 커뮤니티 플랫폼",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "KEPCO AI Study Club",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
