import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LED Wall Configurator",
  description: "MVP foundation for LED wall planning, panel selection, and port mapping."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
