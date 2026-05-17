import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Realis",
  description: "私密的 AI 自我疗愈日记",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#f7faf8] text-[#24302f] antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
