import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-500">
          No Image
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            ₹{product.price}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;