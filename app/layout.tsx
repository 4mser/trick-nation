import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xplorers",
  description: "Haciendo de la vida real un videojuego.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta property="og:title" content="Xplorers" />
          <meta property="og:description" content="Haciendo de la vida real un videojuego." />
          <meta property="og:image" content="/logoXplorers.jpg" />
          <meta property="og:url" content="https://xplorers.vercel.app" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Xplorers" />
          <meta name="twitter:description" content="Haciendo de la vida real un videojuego." />
          <meta name="twitter:image" content="/logoXplorers.jpg" />
        </head>
        <body className="bg-neutral-950">
          <Header />
          <div>
            {children}
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
