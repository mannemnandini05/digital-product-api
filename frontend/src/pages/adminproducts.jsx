import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      setProducts(response.data.items);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load products"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, productData);
        toast.success("Product updated");
      } else {
        await api.post("/products", productData);
        toast.success("Product created");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Operation failed"
      );
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);

      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-3xl font-bold text-slate-900">
          Manage Products
        </h1>

        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              name="image_url"
              placeholder="Image URL"
              value={form.image_url}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-4 py-3"
            />

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
              )}

              <h3 className="text-lg font-bold text-slate-900">
                {product.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {product.description}
              </p>

              <p className="mt-3 text-lg font-bold text-indigo-600">
                ₹{product.price}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminProducts;