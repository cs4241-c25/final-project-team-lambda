// next imports
import type { Metadata } from "next";

// library imports
import { getSession } from "@/lib/auth"
import Providers from "./providers"

// resource imports
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeLog",
  description: "Create and edit custom digital scrapbooks.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get auth session and make it accessible to components
  const session = await getSession()

  return (
    <html lang="en">
      <Providers session={session}>
        {children}
      </Providers>
    </html>
  );
}
