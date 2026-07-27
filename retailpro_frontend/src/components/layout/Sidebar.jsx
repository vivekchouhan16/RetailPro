import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdCategory,
  MdInventory2,
  MdPointOfSale,
  MdReceipt,
  MdLogout,
  MdHome,
  MdPeople,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: MdDashboard, label: "Dashboard" },
  { to: "/categories", icon: MdCategory, label: "Categories" },
  { to: "/products", icon: MdInventory2, label: "Products" },
  { to: "/billing", icon: MdPointOfSale, label: "Billing" },
  { to: "/invoices", icon: MdReceipt, label: "Invoices" },
  { to: "/users", icon: MdPeople, label: "Users" },
];

export default function Sidebar({ open, onClose }) {
  const {user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 z-30 flex flex-col
        transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex
      `}
      >
        <div className="px-4 py-4 border-b border-gray-200">
          <NavLink to={"/"}>
            <p className="font-bold text-blue-600 text-base">RetailPro</p>
          </NavLink>
          <p className="text-xs text-gray-400">Management System</p>
        </div>

        <nav className="flex-1 px-2 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded mb-0.5 text-sm transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon className="text-base flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded w-full text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <MdLogout className="text-base" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
