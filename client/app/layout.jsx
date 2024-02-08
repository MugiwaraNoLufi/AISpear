"use client"
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";
import Script from "next/script";
import { useMemo, useState } from "react";
import { UserContext } from "./(root)/context/UserContext";
// import Alan from "@/components/shared/Alan";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "AI POWER CHATAPP",
//   description: "Career Counseling Bot for students and professionals.",
// };
export default function RootLayout({ children }) {
  const [user, setUser] = useState({
    videoFilter: {
      filterName: false,
      filterPayload: false,
    },
    defaultSettings: {
      publishAudio: true,
      publishVideo: true,
      audioSource: undefined,
      videoSource: undefined,
      audioOutput: undefined,
    },
  });
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <ClerkProvider>
      <UserContext.Provider value={userValue}>
      <html lang="en">
        <Script src="./node_modules/preline/dist/preline.js"></Script>
        <body className={inter.className}>{children}</body>
        {/* <Alan /> */}
        <PrelineScript />
      </html>
      </UserContext.Provider>

    </ClerkProvider>
  );
}
