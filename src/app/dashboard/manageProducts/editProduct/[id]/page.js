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

        setProduct({
          _id: data.product._id || '',
          image: data.product.image || { url: '' },
          slug: data.product.slug || '',
          title: data.product.title || '',
          productNumber: data.product.productNumber || '',
          carName: data.product.carName || '',
        });
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
    setTimeout(() => router.push('/dashboard/manageProducts'), 1500);
  };

  if (loading) {
    return <p className="text-gray-300">Loading product...</p>;
  }

  if (fetchError) {
    return (
      <div>
        <p className="text-red-500">{fetchError}</p>
        <Link href="/dashboard/manageProducts">
          <span className="mt-4 inline-block text-white hover:text-red-500 transition-all duration-300 cursor-pointer">
            Back to Manage Products
          </span>
        </Link>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}