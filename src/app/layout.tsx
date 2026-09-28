import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: { default: `${brand.name} — English Test Preparation`, template: `%s | ${brand.name}` },
  description: brand.description,
  metadataBase: new URL(brand.url),
  openGraph: { title: brand.name, description: brand.description, type: "website", siteName: brand.name },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
