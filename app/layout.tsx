import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Josef's Picture Book",
  description: "A Picture Book generator for 6 year old's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
              <h1 className="text-center text-1xl font-bold text-gray-900">
                Josef&apos;s picture book
              </h1>
            </div>
          </header>
          <main className="flex-grow container mx-auto py-2">{children}</main>
          <footer className="bg-white shadow-sm fixed bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                <a
                  href="https://www.linkedin.com/in/j-brandstetter/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-200 px-2 py-1 rounded-md underline font-bold text-gray-900"
                >
                  Open to Work
                </a>
                | Made with love for Josef ❤️ | By{" "}
                <a
                  href="https://brandstetter.io/Resume_Brandstetter_Jurgen.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Jurgen Brandstetter
                </a>{" "}
                |{" "}
                <a
                  href="https://github.com/BrandiATMuhkuh/josefs-picture-book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Source
                </a>
              </p>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
