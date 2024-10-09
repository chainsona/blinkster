"use client";

import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css"; // Import global styles
import { SolanaProvider } from "@/components/solana-provider";
import LayoutFullscreen from "@/components/layout-fullscreen";
import Content from "@/components/content";
import PageGuard from "@/components/page-guard";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Always set to dark mode on initial load
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background text-text flex h-screen overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <SolanaProvider>
            <LayoutFullscreen>
              <PageGuard>
                <Content>{children}</Content>
              </PageGuard>
            </LayoutFullscreen>
          </SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
