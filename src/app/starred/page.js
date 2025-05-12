"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Products() {
  const [starredProducts, setStarredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStarredProducts = async () => {
      try {
        const res = await fetch('/api/getStarredProducts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch starred products');
        }

        setStarredProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStarredProducts();
  }, []);

  if (loading) {
    return <p className="text-gray-300 text-center">Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <section className="py-12 bg-gray-950">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Featured Products
          </span>
        </h2>
        {starredProducts.length === 0 ? (
          <p className="text-gray-300 text-center">No featured products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {starredProducts.map((product) => (
              <div key={product._id} className="bg-gray-900/80 p-4 rounded-lg shadow-xl border border-gray-700">
                <img
                  src={product.image.url}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                <p className="text-gray-400 mb-2">Product #{product.productNumber}</p>
                <p className="text-gray-400 mb-4">{product.carName}</p>
                <Link href={`/products#${product.slug}`}>
                  <span className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded hover:from-red-700 hover:to-red-800 transition-all duration-300">
                    View Details
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}