"use client";

import { CartProvider } from "@/components/CartContext";
import { OrderProvider } from "@/components/OrderContext";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <html lang="fr">
      <head>
        {/* Add your metadata here */}
        <title>GD Patisserie</title>
      </head>
      <body className={inter.className}>
        <OrderProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
