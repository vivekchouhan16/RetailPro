import Footer from "../components/layout/Footer";
import PublicNavbar from "../components/layout/PublicNavbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          About RetailPro
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          A project built with Spring Boot & React.
        </p>

        <div className="bg-white border border-gray-200 rounded p-5 mb-4">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            What is RetailPro?
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            RetailPro is a web-based retail billing and inventory management
            system designed for small shops and retail businesses. The system
            enables efficient product management, billing, inventory tracking,
            and sales monitoring. Administrators can manage products and stock
            levels, while staff can generate customer bills and maintain
            transaction records. The system helps streamline daily retail
            operations and improve inventory control
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Features
          </h2>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Product & category CRUD</li>
            <li>Point-of-sale billing with cart</li>
            <li>Invoice generation & history</li>
            <li>Low stock alerts</li>
            <li>Role-based access (Admin / Staff)</li>
            <li>Responsive dashboard</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5 mt-4">
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Team Members
          </h2>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {[
              ["Aadil Ansari"],
              ["Anusha Karanje"],
              ["Pankaj Gaikwad"],
              ["Vivek Chouhan"],
              ["Manthan Patne"],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded p-2">
                <p className="font-medium text-gray-700">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
