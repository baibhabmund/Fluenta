import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),

  title: {
    default: `${brand.name} | IELTS, CELPIP & Spoken English Coaching`,
    template: `%s | ${brand.name}`,
  },

  description:
    "Prepare for IELTS, CELPIP and Spoken English with expert coaching, structured courses, practice materials, mock tests and personalised guidance.",

  keywords: [
    "IELTS coaching",
    "IELTS preparation",
    "IELTS classes",
    "IELTS online coaching",
    "CELPIP coaching",
    "CELPIP preparation",
    "CELPIP classes",
    "Spoken English classes",
    "English speaking course",
    "English language coaching",
    "English proficiency test preparation",
    "study abroad English coaching",
  ],

  applicationName: brand.name,

  authors: [
    {
      name: brand.name,
    },
  ],

  creator: brand.name,
  publisher: brand.name,

  alternates: {
    canonical: brand.url,
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

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: brand.url,
    siteName: brand.name,

    title: `${brand.name} | IELTS, CELPIP & Spoken English Coaching`,

    description:
      "Prepare for IELTS, CELPIP and Spoken English with expert coaching, structured courses, practice materials, mock tests and personalised guidance.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${brand.name} - IELTS, CELPIP and Spoken English Coaching`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: `${brand.name} | IELTS, CELPIP & Spoken English Coaching`,

    description:
      "IELTS, CELPIP and Spoken English coaching with structured courses, practice materials, mock tests and personalised guidance.",

    images: ["/og-image.png"],
  },

  category: "education",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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
