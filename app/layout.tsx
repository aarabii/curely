import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Curely - AI Medical Voice Assistant",
  description: "Transform Healthcare with AI-Powered Medical Voice Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} antialiased`}
        >
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
