import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";
import Script from "next/script";
// import Alan from "@/components/shared/Alan";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI POWER CHATAPP",
  description: "Career Counseling Bot for students and professionals.",
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Script src="./node_modules/preline/dist/preline.js"></Script>
        <body className={inter.className}>{children}</body>
        {/* <Alan /> */}
        <PrelineScript />
      </html>
    </ClerkProvider>
  );
}
