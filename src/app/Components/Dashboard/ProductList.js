"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/getProducts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch products');
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
      const res = await fetch('/api/editProduct', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, starred: !currentStarred }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update star status');
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

  if (loading) {
    return <p className="text-gray-300">Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Products List</h3>
      {products.length === 0 ? (
        <p className="text-gray-300">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Product Number</th>
                <th className="p-3">Car Name</th>
                <th className="p-3">Starred</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">
                    <img
                      src={product.image.url}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{product.title}</td>
                  <td className="p-3">{product.slug}</td>
                  <td className="p-3">{product.productNumber}</td>
                  <td className="p-3">{product.carName}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStar(product._id, product.starred)}
                      className={`p-1 rounded transition-all duration-300 ${
                        product.starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'
                      }`}
                    >
                      {product.starred ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link href={`/dashboard/manageProducts/editProduct/${product._id}`}>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-300 cursor-pointer">
                        Edit
                      </span>
                    </Link>
                    <DeleteProductButton productId={product._id} onProductDeleted={handleProductDeleted} />
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