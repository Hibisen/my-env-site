import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choice for the Planet",
  description: "Cloudflare Pages + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
