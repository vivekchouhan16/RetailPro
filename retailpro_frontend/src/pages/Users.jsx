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

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const getAllUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const data = await res.data.data;
      setUsers(data);
      console.log(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserById = async () => {
    setSaving(true);
    try {
      console.log(deleteUser.id);
      await api.delete(`/users/${deleteUser.id}`);
      setDeleteUser(null);
      getAllUser();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    setFormError("");
    try {
      await api.patch(`/users/${editUser.id}`, form);
      setEditUser(null);
      getAllUser();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update User");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage Registered Users" />
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <Td className="w-10 text-gray-400 text-xs font">{idx + 1}</Td>
              <Td>
                <p className="font-medium text-gray-800">{user.name}</p>
              </Td>
              <Td>
                <p className="font-medium text-gray-800">{user.email}</p>
              </Td>
              <Td>
                <p className="font-medium text-gray-800">{user.role}</p>
              </Td>
              <Td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormError("");
                      setEditUser(user);
                    }}
                  >
                    <MdEdit className="text-sm" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setDeleteUser(user)}
                  >
                    <MdDelete className="text-sm" /> Delete
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User Role"
      >
        {editUser && (
          <UserForm
            initial={editUser}
            onSubmit={handleEdit}
            loading={saving}
            error={formError}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Delete User?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Delete <strong>"{deleteUser?.name}"</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteUserById} disabled={saving}>
              {saving && <Spinner />} Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function UserForm({ initial, onSubmit, loading, error }) {
  const [form, setForm] = useState(
    initial ? { role: initial.role || "" } : { role: "" },
  );
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.role) {
      setErrors({ role: "Role is required" });
      return;
    }
    onSubmit({ role: form.role });
  };

  const setField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <Alert type="error" message={error} />}
      <Select
        label="Role *"
        value={form.role}
        onChange={setField("role")}
        error={errors.role}
      >
        <option value="">Select Role</option>
        <option value="ADMIN">ADMIN</option>
        <option value="STAFF">STAFF</option>
      </Select>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" disabled={loading}>
          {loading && <Spinner />}
          Update
        </Button>
      </div>
    </form>
  );
}

export default Users;
