import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 8;

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products", {
        params: {
          page,
          limit,
          search,
        },
      });

      setProducts(response.data.items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Digital Marketplace
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Discover digital products
              <span className="text-indigo-400"> made for you.</span>
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-300 md:text-lg">
              Explore useful digital resources, templates,
              guides and creative products in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Header + Search */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Explore Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Find the right digital product for your needs.
            </p>
          </div>

          <div className="flex w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full rounded-l-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 md:w-80"
            />

            <button
              type="button"
              className="rounded-r-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm">
            <p className="text-slate-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📦
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              No products found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with a different keyword.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="mt-10 flex items-center justify-center gap-4">

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default Products;