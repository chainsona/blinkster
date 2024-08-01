import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const DATA = {
  name: "iBlink",
  description: "No-code Blinks builder for everyone",
  url: "https://iblink.to",
  images: ["https://iblink.to/iblinkto.png", "https://iblink.to/iblinkto.gif"],
  emails: ["gm@iblink.to"],
  xCreator: "@chainsona",
  xUsername: "@iBlinkTo",
};

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
    images: DATA.images,
    emails: DATA.emails,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
    site: DATA.xUsername,
    creator: DATA.xCreator,
    description: DATA.description,
    images: DATA.images,
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-dvh" lang="en">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
