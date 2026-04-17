import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raspberry-pi-project-generator.app"),
  title: "Raspberry Pi Project Generator | Build Projects You Can Actually Finish",
  description:
    "Generate personalized Raspberry Pi project ideas based on your skill level, available components, and interests. Get practical wiring diagrams and step-by-step guides.",
  openGraph: {
    title: "Raspberry Pi Project Generator",
    description:
      "Personalized Raspberry Pi projects with code, wiring diagrams, and realistic build plans matched to your exact parts.",
    type: "website",
    url: "https://raspberry-pi-project-generator.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "Raspberry Pi Project Generator",
    description:
      "Stop scrolling forums. Generate projects matched to your components and skill level in minutes."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d1117] text-[#f5f8ff] antialiased">
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
