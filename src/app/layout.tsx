import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Scroller",
  description: "Church worship lyric auto-scroller for projection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-950 text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
