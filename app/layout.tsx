import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OneAtlas Runtime Builder",
    template: "%s | OneAtlas Runtime Builder",
  },
  description:
    "AI-native runtime app generation platform for editable schemas, conversational mutations, version history, and frozen previews.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "OneAtlas Runtime Builder",
    description:
      "Generate runtime apps from prompts, edit schemas conversationally, and share immutable previews.",
    siteName: "OneAtlas Runtime Builder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} antialiased`}>
        <TooltipProvider delayDuration={120}>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
