import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { BASE_FONT_SIZE_PX, portfolioConfig, px } from "@/lib/portfolio-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const { siteTitle, siteDescription, ogImage, defaultTheme } = portfolioConfig.meta;

// Next.js doesn't prepend basePath to the auto-generated icon.tsx <link> href
// (https://github.com/vercel/next.js/issues/61487), so it's set explicitly here.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  icons: {
    icon: `${basePath}/icon`,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} style={{ fontSize: px(BASE_FONT_SIZE_PX) }} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme={defaultTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
