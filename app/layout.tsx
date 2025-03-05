import type { Metadata } from "next";
import { Geist, Geist_Mono ,Poppins} from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable:'--font-poppins',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DefiLab",
  description: "DefiLab is a platform for competing in high tech challenges.", 
  icons:{
    icon:'/assets/images/logo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} `}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
    
    
  );
}
