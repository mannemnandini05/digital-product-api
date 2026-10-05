import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.detail ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/items", {
        product_id: Number(id),
        quantity,
      });

      toast.success("Product added to cart");
      navigate("/cart");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to add product to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">

          {/* Product Image */}
          <div>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-96 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-bold text-blue-600">
              ₹{product.price}
            </p>

            {/* Quantity */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/products")}
              className="mt-3 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Products
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;