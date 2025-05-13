"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddProductForm from '@/app/Components/Dashboard/AddProductForm';
import ProductList from '@/app/Components/Dashboard/ProductList';

export default function ManageProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshList, setRefreshList] = useState(false); // State to trigger ProductList refresh

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch('/api/verifyAdminToken', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error('Token verification failed');
        }

        setLoading(false);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message);
        router.push('/adminLogin');
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    router.push('/adminLogin');
  };

  const handleProductAdded = () => {
    setRefreshList((prev) => !prev); // Toggle to trigger ProductList refresh
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
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Redirecting to /adminLogin, so no need to render anything
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
              Manage Products
            </span>
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Add Product Form */}
        <div className="mb-12">
          <AddProductForm onProductAdded={handleProductAdded} />
        </div>

        {/* Product List */}
        <div>
          <ProductList refresh={refreshList} />
        </div>
      </main>
    </div>
  );
}