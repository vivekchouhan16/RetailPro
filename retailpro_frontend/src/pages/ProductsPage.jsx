import { useEffect, useState, useCallback } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdInventory2,
  MdSearch,
  MdWarning,
  MdRefresh,
} from "react-icons/md";
import api from "../services/api";
import {
  PageHeader,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  Table,
  Th,
  Td,
  Badge,
  Alert,
  Spinner,
  EmptyState,
  StatCard,
} from "../components/ui";

function ProductForm({ initial, categories, onSubmit, loading, error }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
    },
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      e.price = "Valid price required";
    if (
      !form.stockQuantity ||
      isNaN(form.stockQuantity) ||
      Number(form.stockQuantity) < 0
    )
      e.stockQuantity = "Valid quantity required";
    if (!form.categoryId) e.categoryId = "Select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate())
      onSubmit({
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: Number(form.categoryId),
      });
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <Alert type="error" message={error} />}
      <Input
        label="Product Name *"
        placeholder="e.g. Amul Milk"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
      />
      <Textarea
        label="Description"
        placeholder="Enter Product description (Optional)"
        value={form.description}
        onChange={set("description")}
        rows={2}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price (₹) *"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.price}
          onChange={set("price")}
          error={errors.price}
        />
        <Input
          label="Stock Qty *"
          type="number"
          min="0"
          placeholder="0"
          value={form.stockQuantity}
          onChange={set("stockQuantity")}
          error={errors.stockQuantity}
        />
      </div>
      <Select
        label="Category *"
        value={form.categoryId}
        onChange={set("categoryId")}
        error={errors.categoryId}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {initial ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);
      setProducts(pRes.data.data || pRes.data);
      setCategories(cRes.data.data || cRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const doSearch = async (q) => {
    if (!q.trim()) {
      fetchAll();
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(
        `/products/search?keyword=${encodeURIComponent(q)}`,
      );
      setProducts(res.data.data || res.data);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStock = async () => {
    setLoading(true);
    setShowLowStock(true);
    try {
      const res = await api.get("/products/low-stock");
      setProducts(res.data.data || res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (form) => {
    setSaving(true);
    setFormError("");
    try {
      await api.post("/products", form);
      setAddOpen(false);
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    setFormError("");
    try {
      await api.put(`/products/${editItem.id}`, form);
      setEditItem(null);
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/products/${deleteItem.id}`);
      setDeleteItem(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= 5).length;

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory"
        action={
          <Button
            onClick={() => {
              setFormError("");
              setAddOpen(true);
            }}
          >
            <MdAdd /> Add Product
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={MdInventory2}
          color="blue"
        />
        <StatCard
          title="Low Stock"
          value={lowStockCount}
          icon={MdWarning}
          color="orange"
          subtitle="≤ 5 units"
        />
        <StatCard
          title="Total Stock"
          value={products
            .reduce((s, p) => s + p.stockQuantity, 0)
            .toLocaleString()}
          icon={MdInventory2}
          color="green"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded p-3 mb-4 flex flex-wrap items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch(search);
          }}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <div className="relative flex-1 max-w-xs">
            <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value) fetchAll();
              }}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
        {showLowStock ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowLowStock(false);
              setSearch("");
              fetchAll();
            }}
          >
            <MdRefresh className="text-sm" /> Show All
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-500 hover:bg-orange-50"
            onClick={loadLowStock}
          >
            <MdWarning className="text-sm" /> Low Stock
          </Button>
        )}
      </div>

      {showLowStock && (
        <div className="bg-orange-50 border border-orange-200 rounded p-2.5 mb-3 flex items-center gap-2 text-sm text-orange-700">
          <MdWarning className="text-orange-500" />
          Showing products with low stock (≤ 5 units)
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="text-blue-600 w-6 h-6" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded">
          <EmptyState
            icon={MdInventory2}
            title="No products found"
            description='Click "Add Product" to get started'
          />
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <Td className="w-10 text-gray-400 text-xs">{idx + 1}</Td>
                <Td>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-gray-400">
                      {product.description}
                    </p>
                  )}
                </Td>
                <Td>
                  <Badge variant="info">{product.categoryName}</Badge>
                </Td>
                <Td className="font-medium text-gray-800">
                  ₹{product.price.toLocaleString()}
                </Td>
                <Td>
                  {product.stockQuantity <= 5 ? (
                    <Badge variant="warning">
                      <MdWarning className="text-xs mr-0.5" />
                      {product.stockQuantity} units
                    </Badge>
                  ) : (
                    <Badge variant="success">
                      {product.stockQuantity} units
                    </Badge>
                  )}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormError("");
                        setEditItem(product);
                      }}
                    >
                      <MdEdit className="text-sm" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteItem(product)}
                    >
                      <MdDelete className="text-sm" /> Delete
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Product"
      >
        <ProductForm
          categories={categories}
          onSubmit={handleAdd}
          loading={saving}
          error={formError}
        />
      </Modal>
      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Product"
      >
        {editItem && (
          <ProductForm
            initial={{
              ...editItem,
              categoryId: editItem.categoryId?.toString() || "",
            }}
            categories={categories}
            onSubmit={handleEdit}
            loading={saving}
            error={formError}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Delete <strong>"{deleteItem?.name}"</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={saving}>
              {saving && <Spinner />} Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
