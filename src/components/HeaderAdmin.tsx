import { ListChecks, ScanBarcode } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderAdmin() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center bg-amber-950/80 justify-between px-4 py-3 text-white shadow-sm sm:px-6 lg:px-8 mb-8">
      <a
        onClick={() => {
          navigate("/ProductsPage");
        }}
        className="flex items-center space-x-2 cursor-pointer hover:bg-amber-950 p-2 rounded focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <span className="text-4xl font-bold font-imperial">GD Patisserie</span>
      </a>
      <div className="flex items-center space-x-4">
        <a
          onClick={() => {
            navigate("/ProductsAdmin");
          }}
          href="#"
          className="rounded-md px-3 py-2 text-sm font-medium  hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <ScanBarcode />
        </a>
        <a
          href="#"
          className="rounded-md px-3 py-2 text-sm font-medium  hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
          onClick={() => {
            navigate("/OrdersAdmin");
          }}
        >
          <ListChecks />
        </a>
      </div>
    </header>
  );
}
