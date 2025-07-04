import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { JotaiProvider } from "~/common/providers/JotaiProvider";
import { ThemeProvider } from "~/common/providers/ThemeProvider";
import { SEO } from "~/constants";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: SEO.appTitle,
  description: SEO.appDescription,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <ClerkProvider>
            <JotaiProvider>
              <TRPCReactProvider>
                <Toaster richColors />
                {children}
              </TRPCReactProvider>
            </JotaiProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
