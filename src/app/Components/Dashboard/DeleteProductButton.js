"use client";

import { useState } from 'react';

export default function DeleteProductButton({ productId, onProductDeleted }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/deleteProduct', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      onProductDeleted();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className={`px-3 py-1 rounded text-white transition-all duration-300 ${
          loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
        }`}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {message && (
        <div
          className={`mt-2 p-2 rounded text-sm ${
            message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}