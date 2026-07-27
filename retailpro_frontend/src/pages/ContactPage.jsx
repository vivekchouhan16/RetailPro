import { useState } from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <PublicNavbar />
        <div className="max-w-lg mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Contact</h1>
          <p className="text-sm text-gray-500 mb-6">
            Have questions? Send us a message.
          </p>

          <div className="bg-white border border-gray-200 rounded p-5">
            {sent ? (
              <div className="text-center py-6">
                <p className="text-green-600 font-medium mb-1">Message sent!</p>
                <p className="text-sm text-gray-500">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="mt-4 text-sm text-blue-600 hover:underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    required
                    placeholder="Enter Your name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    placeholder="your@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    required
                    rows={4}
                    placeholder="Enter Your message..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
