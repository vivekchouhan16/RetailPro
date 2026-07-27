import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdCategory, MdSearch } from "react-icons/md";
import api from "../services/api";
import {
  PageHeader,
  Button,
  Modal,
  Input,
  Textarea,
  Table,
  Th,
  Td,
  Alert,
  Spinner,
  EmptyState,
} from "../components/ui";
import { useAuth } from "../context/AuthContext";

function CategoryForm({ initial, onSubmit, loading, error }) {
  const [form, setForm] = useState(initial || { name: "", description: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <Alert type="error" message={error} />}
      <Input
        label="Category Name *"
        placeholder="e.g. Dairy Products"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />
      <Textarea
        label="Description"
        placeholder="Brief description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {initial ? "Update" : "Add Category"}
        </Button>
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { user } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const data = res.data.data || res.data;
      setCategories(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      ),
    );
  }, [search, categories]);

  const handleAdd = async (form) => {
    setSaving(true);
    setFormError("");
    try {
      await api.post("/categories", form);
      setAddOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    setFormError("");
    try {
      await api.put(`/categories/${editItem.id}`, form);
      setEditItem(null);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/categories/${deleteItem.id}`);
      setDeleteItem(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize products into categories"
        action={
          <Button
            onClick={() => {
              setFormError("");
              setAddOpen(true);
            }}
          >
            <MdAdd /> Add Category
          </Button>
        }
      />

      <div className="bg-white border border-gray-200 rounded p-3 mb-4">
        <div className="relative max-w-xs">
          <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="text-blue-600 w-6 h-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded">
          <EmptyState
            icon={MdCategory}
            title="No categories found"
            description={
              search
                ? "Try a different search"
                : 'Click "Add Category" to get started'
            }
          />
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat, idx) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <Td className="w-10 text-gray-400 text-xs">{idx + 1}</Td>
                <Td>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                </Td>
                <Td className="text-gray-500">
                  {cat.description || (
                    <span className="text-gray-300 italic text-xs">—</span>
                  )}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormError("");
                        setEditItem(cat);
                      }}
                    >
                      <MdEdit className="text-sm" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteItem(cat)}
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
        title="Add Category"
      >
        <CategoryForm onSubmit={handleAdd} loading={saving} error={formError} />
      </Modal>
      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Category"
      >
        {editItem && (
          <CategoryForm
            initial={editItem}
            onSubmit={handleEdit}
            loading={saving}
            error={formError}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Category"
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
