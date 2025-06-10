"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import EditProductForm from '@/app/Components/Dashboard/EditProductForm';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/getProductById?id=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }

        const data = await res.json();

        if (!data.product) {
          throw new Error('Product data not available');
        }

        setProduct(data.product); // Set the entire product object as-is
        setLoading(false);
      } catch (err) {
        setFetchError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleProductUpdated = () => {
    setMessage({ type: 'success', text: 'Product updated successfully!' });
    setTimeout(() => router.push('/dashboard/manageProducts/productlist'), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading product...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{fetchError}</p>
          <Link href="/dashboard/manageProducts">
            <span className="mt-4 inline-block text-white hover:text-red-500 transition-all duration-300 cursor-pointer">
              Back to Manage Products
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/70 to-transparent"></div>

      {/* Main Content */}
      <main className="relative z-10 p-6 mt-8 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Edit Product
            </span>
          </h2>
          <Link href="/dashboard/manageProducts">
            <span className="text-white hover:text-red-500 transition-all duration-300 cursor-pointer">
              Back to Manage Products
            </span>
          </Link>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl border border-gray-700">
          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}
          <EditProductForm product={product} onProductUpdated={handleProductUpdated} />
        </div>
      </main>
    </div>
  );
}