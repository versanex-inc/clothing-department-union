'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Palette, Ruler, Package } from 'lucide-react';

export default function CheckoutPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState(null);

  // Get details from query parameters
  const selectedImageUrl = searchParams.get('imageUrl') || '/placeholder.svg';
  const productTitle = searchParams.get('productTitle') || 'Unknown Product';
  const price = parseFloat(searchParams.get('price')) || 0;
  const selectedColor = searchParams.get('color') || 'N/A';
  const selectedSize = searchParams.get('size') || 'N/A';
  const quantity = parseInt(searchParams.get('quantity')) || 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/getProductBySlug?slug=${slug}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
      }
    };
    fetchProduct();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!product) {
      setError('Product details not loaded');
      return;
    }

    try {
      const totalPrice = price * quantity; // Calculate total price
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          fullName,
          phoneNumber,
          address,
          productTitle,
          price,
          quantity,
          totalPrice, // Save total price
          imageUrl: selectedImageUrl, // Use the passed image URL
          selectedSize,
          selectedColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/thank-you');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const subtotal = price * quantity;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-200">
                Home
              </Link>
            </li>
            <li className="text-gray-600">|</li>
            <li>
              <Link href="/shop" className="text-gray-400 hover:text-gray-200">
                Shop
              </Link>
            </li>
            <li className="text-gray-600">|</li>
            <li>
              <Link href={`/shop/${slug}`} className="text-gray-400 hover:text-gray-200">
                {slug}
              </Link>
            </li>
            <li className="text-gray-600">|</li>
            <li className="text-gray-400">Checkout</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-wide text-white uppercase mb-8">Checkout</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-md">
            Order placed successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
            {error}
          </div>
        )}

        {!product ? (
          <p className="text-gray-200">Loading product details...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Summary (Left) */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-gray-700 shadow-lg">
              <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2" /> Order Summary
              </h2>
              <div className="flex flex-col space-y-4">
                {/* Product Image and Basic Info */}
                <div className="flex items-start space-x-4">
                  <Image
                    src={selectedImageUrl}
                    alt={productTitle}
                    width={150}
                    height={180}
                    className="object-cover rounded-md border border-gray-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white uppercase">{productTitle}</h3>
                    <p className="text-gray-400 mt-1">Brand: {product.brand || 'N/A'}</p>
                    <p className="text-gray-400 mt-1">Category: {product.category || 'N/A'}</p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-gray-400" />
                      <p className="text-gray-400">Color: <span className="text-white">{selectedColor}</span></p>
                    </div>
                    <div className="flex items-center">
                      <Ruler className="w-5 h-5 mr-2 text-gray-400" />
                      <p className="text-gray-400">Size: <span className="text-white">{selectedSize}</span></p>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-gray-400" />
                      <p className="text-gray-400">Quantity: <span className="text-white">{quantity}</span></p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-gray-400">Material: <span className="text-white">{product.material || 'N/A'}</span></p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Price per Item:</span>
                      <span>PKR {price}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold">
                      <span>Total:</span>
                      <span>PKR {subtotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form (Right) */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-gray-700 shadow-lg">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-gray-200 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-200 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-gray-200 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-200 mb-1">Payment Method</label>
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200">
                    Cash on Delivery (COD)
                  </div>
                  {/* Subtotal Display */}
                  <div className="mt-2 p-3 bg-gray-700 rounded-md text-white font-semibold">
                    Subtotal: PKR {subtotal}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-br from-gray-900 to-black text-white font-medium rounded-md border border-gray-700 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}