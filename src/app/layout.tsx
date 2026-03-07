import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./_components/Nav/Nav";
import AuthSessionProvidor from "./providor/authSessionProvidor";
import QueryProvidor from "./providor/QueryProvidor";
import { PostProvider } from "./context/pageContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social app",
  description: "Facebook clone",
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
        <AuthSessionProvidor>
            <QueryProvidor>
              <PostProvider>
              <Nav/>
              {children}
              </PostProvider>
            </QueryProvidor>
        </AuthSessionProvidor>
      </body>
    </html>
  );
}
