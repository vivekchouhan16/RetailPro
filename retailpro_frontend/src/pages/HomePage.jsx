import { Link } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import {
  MdInventory2,
  MdPointOfSale,
  MdReceipt,
  MdCategory,
  MdSpeed,
  MdSecurity,
} from "react-icons/md";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: MdInventory2,
    title: "Inventory Management",
    desc: "Track stock levels and get low stock alerts.",
  },
  {
    icon: MdCategory,
    title: "Category Organization",
    desc: "Organize products with categories for easier lookup.",
  },
  {
    icon: MdPointOfSale,
    title: "POS Billing",
    desc: "Add items to cart and generate invoices quickly.",
  },
  {
    icon: MdReceipt,
    title: "Invoice History",
    desc: "View and search all past billing transactions.",
  },
  {
    icon: MdSpeed,
    title: "Dashboard Stats",
    desc: "Overview of products, categories, and invoices.",
  },
  {
    icon: MdSecurity,
    title: "Role-Based Access",
    desc: "JWT-secured APIs with Admin and Staff roles.",
  },
];

export default function HomePage() {

  const {user} = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <PublicNavbar />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            RetailPro - Billing & Inventory System
          </h1>
          <p className="text-gray-500 max-w-xl mb-6">
            RetailPro is a retail billing and inventory management system
            designed for small shops and retail businesses. The system enables
            efficient product management, billing, inventory tracking, and sales
            monitoring
          </p>
          {!user ? (
            <div className="flex gap-3">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded font-medium"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <p className="text-xl text-blue-700">
                Welcome Back, <span className="font-bold animate-pulse">{user.name}</span>
              </p>
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded p-4"
            >
              <Icon className="text-xl text-blue-600 mb-2" />
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                {title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
