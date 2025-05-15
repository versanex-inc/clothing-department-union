'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/getOrders');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-gray-200 mx-auto shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
          <p className="text-gray-200 mt-4 uppercase tracking-wide text-base">Loading Orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-gray-200 text-center text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-200">
                Home
              </Link>
            </li>
            <li className="text-gray-600">|</li>
            <li className="text-gray-400">Manage Orders</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-wide text-white uppercase mb-6">Manage Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-200">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900">
                  <th className="p-3 text-gray-200">Order ID</th>
                  <th className="p-3 text-gray-200">Product Image</th>
                  <th className="p-3 text-gray-200">Product Title</th>
                  <th className="p-3 text-gray-200">Slug</th>
                  <th className="p-3 text-gray-200">Total Price (PKR)</th>
                  <th className="p-3 text-gray-200">Quantity</th>
                  <th className="p-3 text-gray-200">Color</th>
                  <th className="p-3 text-gray-200">Size</th>
                  <th className="p-3 text-gray-200">Full Name</th>
                  <th className="p-3 text-gray-200">Phone Number</th>
                  <th className="p-3 text-gray-200">Address</th>
                  <th className="p-3 text-gray-200">Payment Method</th>
                  <th className="p-3 text-gray-200">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-800">
                    <td className="p-3 text-gray-200">{order._id}</td>
                    <td className="p-3">
                      {order.imageUrl ? (
                        <Image
                          src={order.imageUrl}
                          alt={order.productTitle || 'Product Image'}
                          width={50}
                          height={60}
                          className="object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-200">N/A</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-200">{order.productTitle || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.slug || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.totalPrice ? `PKR ${order.totalPrice}` : 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.quantity || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.selectedColor || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.selectedSize || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.fullName || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.phoneNumber || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.address || 'N/A'}</td>
                    <td className="p-3 text-gray-200">{order.paymentMethod || 'N/A'}</td>
                    <td className="p-3 text-gray-200">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}