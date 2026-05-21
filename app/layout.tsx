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

export const metadata: Metadata = {
  title: "Dan Semenescu — Founder, DansLab",
  description:
    "Multi-Agent AI Architecture. Founder of DansLab and Stack Finance LLC — building named AI agent fleets that orchestrate, ship, and operate real products. MyWork-AI, ZmartyChat, OpenClaw.",
};

// Deterministic pseudo-random for SSR-safe star placement
const r = (n: number) => {
  const x = Math.sin(n * 9999) * 10000;
  return x - Math.floor(x);
};

type StarSpec = { x: number; y: number; size: number; delay: number; duration: number };
const makeStars = (count: number, size: number, seedOffset: number): StarSpec[] =>
  Array.from({ length: count }, (_, i) => ({
    x: r(i + seedOffset) * 100,
    y: r(i + seedOffset + 1000) * 100,
    size,
    delay: r(i + seedOffset + 2000) * 6,
    duration: 3 + r(i + seedOffset + 3000) * 4,
  }));

const tinyStars = makeStars(90, 1, 1);
const mediumStars = makeStars(25, 2, 100);
const brightStars = makeStars(10, 2.5, 200);

function Universe() {
  return (
    <div className="universe-bg" aria-hidden>
      {tinyStars.map((s, i) => (
        <span
          key={`t${i}`}
          className="star star-tiny"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {mediumStars.map((s, i) => (
        <span
          key={`m${i}`}
          className="star star-medium"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {brightStars.map((s, i) => (
        <span
          key={`b${i}`}
          className="star star-bright"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <div className="comet comet-1" />
      <div className="comet comet-2" />
      <div className="comet comet-3" />
      <div className="comet comet-4" />
      <div className="comet comet-5" />
    </div>
  );
}

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
      <body className="min-h-full flex flex-col bg-background relative">
        <Universe />
        {children}
      </body>
    </html>
  );
}
