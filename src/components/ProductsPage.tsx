import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { ProductCard } from "./ProductCard";
import { SelectCategory } from "./SelectCategory";

interface Product {
  Id: string;
  Picture: string;
  Name: string;
  Price: string;
  Description: string;
  Category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("products.json")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error loading products:", error));
  }, []);

  return (
    <div>
      <Header />
      <h1 className="text-6xl font-extrabold font-imperial text-center mb-8">
        Nos produits
      </h1>
      <div className="flex justify-center mb-8">
        <SelectCategory />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-4">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            id={product.Id}
            picture={product.Picture}
            name={product.Name}
            price={product.Price}
            description={product.Description}
            category={product.Category}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}
