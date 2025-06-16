"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteProductButton from "./DeleteProductButton";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/getProducts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.products || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleToggleStar = async (productId, currentStarred) => {
    try {
      const data = new FormData();
      data.append("id", productId);
      data.append("starred", !currentStarred);

      const res = await fetch("/api/editProduct", {
        method: "PUT",
        body: data,
      });

      const dataRes = await res.json();

      if (!res.ok) {
        throw new Error(dataRes.error || "Failed to update star status");
      }

      fetchProducts(); // Refresh the list after toggling star
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductUpdated = () => {
    fetchProducts(); // Refresh the list after an update
  };

  const handleProductDeleted = () => {
    fetchProducts(); // Refresh the list after a deletion
  };

  const getColorClass = (color) => {
    // Return the raw color value from the database (e.g., hex, RGB, or color name)
    return color || "#000000"; // Fallback to black if color is invalid or undefined
  };

  if (loading) {
    return <p className="text-gray-300">Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">
        {" "}
        <Link href={"/dashboard/manageProducts/productlist"}>Product List</Link>
      </h3>
      {products.length === 0 ? (
        <p className="text-gray-300">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Color</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Starred</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3">{product.title}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-2">
                        {product.color.map((color, index) => (
                          <div
                            key={index}
                            className="h-5 w-5 rounded-full ring-1 ring-gray-600"
                            style={{ backgroundColor: getColorClass(color) }} // Apply color directly
                            aria-label={color}
                            title={color} // Optional: Show color name on hover
                          ></div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{product.slug}</td>
                  <td className="p-3">
                    {product.price ? `$${product.price.toFixed(2)}` : "N/A"}
                  </td>
                  <td className="p-3">{product.category || "N/A"}</td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleToggleStar(product._id, product.starred)
                      }
                      className={`p-1 rounded transition-all duration-300 ${
                        product.starred
                          ? "text-yellow-400"
                          : "text-gray-400 hover:text-yellow-300"
                      }`}
                    >
                      {product.starred ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/dashboard/manageProducts/editProduct/${product._id}`}
                    >
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-300 cursor-pointer">
                        Edit it
                      </span>
                    </Link>
                    <DeleteProductButton
                      productId={product._id}
                      onProductDeleted={handleProductDeleted}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
