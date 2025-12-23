import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ToastInitializer from "@/components/providers/ToastInitializer";

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TravelQuest",
  description: "TravelQuest is a full-stack travel logging platform that lets users record, organize, and explore their adventures on an interactive map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          <ToastInitializer />
          <QueryProvider>
            <Navbar/>
            <div className="max-w-7xl mx-auto px-4 pt-6">
            {children}
            </div>
            <Footer/>
          </QueryProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
