import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { Toaster } from "/src/@/components/ui/toaster";

import "./globals.css";
import { cn } from "/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AP - Admin Panel",
  description: "Acesso a cadastro de distribuidores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          dmSans.className
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
