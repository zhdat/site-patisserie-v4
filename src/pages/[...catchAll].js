"use client";

import HeroSectionGradientBackground from "@/components/HeroSectionGradientBackground";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const AdminPage = dynamic(
  () => import("@/components/AdminPage").then((mod) => mod.AdminPage),
  { ssr: false }
);
const OrdersAdmin = dynamic(
  () => import("@/components/OrdersAdmin").then((mod) => mod.OrdersAdmin),
  { ssr: false }
);
const ProductsAdmin = dynamic(
  () => import("@/components/ProductsAdmin").then((mod) => mod.ProductsAdmin),
  { ssr: false }
);
const ProductPage = dynamic(
  () => import("@/components/ProductPage").then((mod) => mod.ProductPage),
  { ssr: false }
);
const ProductsPage = dynamic(
  () => import("@/components/ProductsPage").then((mod) => mod.default),
  { ssr: false }
);

export default function CatchAll() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSectionGradientBackground />} />
        <Route path="/ProductsPage" element={<ProductsPage />} />
        <Route path="/ProductPage" element={<ProductPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/ProductsAdmin" element={<ProductsAdmin />} />
        <Route path="/OrdersAdmin" element={<OrdersAdmin />} />
      </Routes>
    </Router>
  );
}
