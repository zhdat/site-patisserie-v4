export default function Footer() {
  return (
    <footer className="bg-amber-950/80 text-white py-2 md:py-4 mt-6">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <a href="#">
            <span className="text-lg font-bold">GD Patisserie</span>
          </a>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">
            &copy; 2024 GD Patisserie All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
