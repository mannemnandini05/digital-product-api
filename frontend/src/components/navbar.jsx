import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
      <Link to="/products" className="text-xl font-bold">
        Digital Store
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/products" className="hover:text-gray-300">
          Products
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/cart" className="hover:text-gray-300">
              Cart
            </Link>

            <Link to="/orders" className="hover:text-gray-300">
              Orders
            </Link>

            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-2 hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}

        {!isAuthenticated && (
          <Link
            to="/login"
            className="rounded bg-blue-600 px-3 py-2 hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;