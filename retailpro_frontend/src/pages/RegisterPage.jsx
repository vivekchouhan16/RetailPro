import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    // role: "STAFF",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/;

    if (!form.name.trim()) {
      e.name = "Name is required";
    } else if (form.name.trim().length < 3) {
      e.name = "Name must be at least 3 characters";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      e.email = "Enter a valid Gmail, Yahoo, Outlook or Hotmail address";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      e.password =
        "Password must be at least 8 characters with one digit and one special character";
    }

    if (!form.confirm) {
      e.confirm = "Confirm password is required";
    } else if (form.password !== form.confirm) {
      e.confirm = "Passwords do not match";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        // role: form.role,
      });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">RetailPro</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded border border-gray-200 p-6">
          {apiError && <Alert type="error" message={apiError} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit} className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-0.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="your@example.com"
                value={form.email}
                onChange={set("email")}
                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 8 characters, 1 special character & number"
                value={form.password}
                onChange={set("password")}
                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.password ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-0.5">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={form.confirm}
                onChange={set("confirm")}
                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.confirm ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.confirm && (
                <p className="text-xs text-red-600 mt-0.5">{errors.confirm}</p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={set("role")}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
              </select>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded text-sm flex items-center justify-center gap-2"
            >
              {loading && <Spinner />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
