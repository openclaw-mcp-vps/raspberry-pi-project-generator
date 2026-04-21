import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://raspberry-pi-project-generator.vercel.app"),
  title: {
    default: "Raspberry Pi Project Generator",
    template: "%s | Raspberry Pi Project Generator"
  },
  description:
    "Generate personalized Raspberry Pi project ideas based on your skills, hardware, and interests. Get practical build guides, code examples, and wiring plans.",
  keywords: [
    "raspberry pi",
    "maker tools",
    "electronics projects",
    "iot ideas",
    "gpio project generator",
    "hardware hobbyist"
  ],
  openGraph: {
    type: "website",
    title: "Raspberry Pi Project Generator",
    description:
      "Stop hunting through random tutorials. Get projects that fit your exact parts and skill level.",
    url: "https://raspberry-pi-project-generator.vercel.app",
    siteName: "Raspberry Pi Project Generator"
  },
  twitter: {
    card: "summary_large_image",
    title: "Raspberry Pi Project Generator",
    description:
      "Personalized Raspberry Pi builds with wiring diagrams and working starter code."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d1117] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
