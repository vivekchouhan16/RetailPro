import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdCategory,
  MdInventory2,
  MdReceipt,
  MdPointOfSale,
} from "react-icons/md";
import api from "../services/api";
import { StatCard, PageHeader, Spinner } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const quickActions = [
  { to: "/categories", icon: MdCategory, label: "Categories" },
  { to: "/products", icon: MdInventory2, label: "Products" },
  { to: "/billing", icon: MdPointOfSale, label: "New Invoice" },
  { to: "/invoices", icon: MdReceipt, label: "Invoices" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/admin")
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Welcome, ${user?.name}`} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="text-blue-600 w-6 h-6" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Categories"
              value={stats?.totalCategories ?? 0}
              icon={MdCategory}
              color="blue"
            />
            <StatCard
              title="Products"
              value={stats?.totalProducts ?? 0}
              icon={MdInventory2}
              color="green"
            />
            <StatCard
              title="Invoices"
              value={stats?.totalInvoices ?? 0}
              icon={MdReceipt}
              color="purple"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Icon className="text-base" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
