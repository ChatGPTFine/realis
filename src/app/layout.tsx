import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Realis 返照",
  description: "私密的 AI 心理陪伴与自我觉察空间",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <div className="grain" />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
