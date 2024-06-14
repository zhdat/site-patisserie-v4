import { ScanFace } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { CartDrawer } from "./CartDrawer";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (count, product) => count + (product.quantity || 1),
    0
  );

  return (
    <header className="flex items-center justify-between bg-amber-950/80 px-4 py-3 text-white shadow-sm sm:px-6 lg:px-8 mb-8">
      <div
        onClick={() => {
          navigate("/ProductsPage");
        }}
        className="text-4xl font-bold font-imperial cursor-pointer hover:bg-amber-950 p-2 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        GD Patisserie
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
          <CartDrawer cartCount={cartCount} />
        </div>
        <div
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
          onClick={() => {
            navigate("/AdminPage");
          }}
        >
          <ScanFace />
        </div>
      </div>
    </header>
  );
}
