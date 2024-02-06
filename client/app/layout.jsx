import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { IconBase } from "react-icons";
import PrelineScript from "@/components/PrelineScript";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Career Counseling Bot",
  description: "Career Counseling Bot for students and professionals.",
  IconBase: "https://cdn-icons-png.flaticon.com/512/2958/2958783.png",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Script src="./node_modules/preline/dist/preline.js"></Script>
        <body className={inter.className}>{children}</body>
        <PrelineScript />
      </html>
    </ClerkProvider>
  );
}
