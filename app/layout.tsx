import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://wissammerhi.dev";
const DESCRIPTION =
  "Portfolio of Wissam Merhi — MSc AI student at Maastricht University specialising in LLMs, multi-agent systems, and applied AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Wissam Merhi",
  description: DESCRIPTION,
  keywords: [
    "Wissam Merhi",
    "AI Engineer",
    "LLM Engineer",
    "Machine Learning",
    "NLP",
    "Reinforcement Learning",
    "Maastricht University",
    "Portfolio",
  ],
  authors: [{ name: "Wissam Merhi", url: SITE_URL }],
  creator: "Wissam Merhi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Wissam Merhi",
    title: "Wissam Merhi — AI & LLM Engineer",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "Wissam Merhi — AI & LLM Engineer",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Wissam Merhi",
  url: SITE_URL,
  jobTitle: "AI & LLM Engineer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Maastricht University" },
  knowsAbout: ["Large Language Models", "Multi-Agent Systems", "NLP", "Reinforcement Learning", "PyTorch"],
  sameAs: [
    "https://github.com/wissam6",
    "https://www.linkedin.com/in/wissammerhi/",
    "https://www.youtube.com/@mightywissam",
    "https://www.instagram.com/wissam_6/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
