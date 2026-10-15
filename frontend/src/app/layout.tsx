import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naxa | Invoice compliance review",
  description: "Review invoice and purchase order evidence before payment.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
