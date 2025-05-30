"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Minus, Plus, ChevronDown, X, Search, ShoppingBag, User, RulerIcon } from 'lucide-react';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/getProductBySlug?slug=${slug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product);
          if (data.product.color && data.product.color.length > 0) {
            setSelectedColor(data.product.color[0]);
          }
          if (data.product.size && data.product.size.length > 0) {
            setSelectedSize(data.product.size[0]);
          }
        } else {
          setError(data.error || "Failed to load product");
        }
      } catch (err) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-gray-200 mx-auto shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
          <p className="text-gray-200 mt-4 uppercase tracking-wide text-base">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-gray-200 text-center text-base">{error || "Product not found"}</p>
      </div>
    );
  }

  const discountPercentage = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const getColorClass = (color) => {
    // Return the raw color value from the database (e.g., hex, RGB, or color name)
    return color || '#000000'; // Fallback to black if color is invalid or undefined
  };

  const selectedImageUrl = product.images && product.images.length > 0
    ? (product.images[selectedImage]?.url || product.images[0].url)
    : '/placeholder.svg';

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm">
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
            <li className="text-gray-400">{product.title}</li>
          </ol>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="flex">
              <div className="mr-4 hidden flex-col space-y-4 md:flex">
                {product.images && product.images.map((image, index) => (
                  <button 
                    key={index} 
                    className={`h-24 w-24 overflow-hidden border ${selectedImage === index ? 'border-gray-200' : 'border-gray-700'} bg-gradient-to-br from-gray-900 to-black`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className={`relative flex-1 bg-gradient-to-br from-gray-900 to-black border border-gray-700 mb-4`}>
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]?.url || product.images[0].url}
                    alt={product.title}
                    width={500}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:hidden">
              {product.images && product.images.map((image, index) => (
                <button 
                  key={index} 
                  className={`h-24 w-24 overflow-hidden border ${selectedImage === index ? 'border-gray-200' : 'border-gray-700'} bg-gradient-to-br from-gray-900 to-black flex-shrink-0`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl font-bold tracking-wide text-white uppercase">{product.title}</h1>

            <p className="text-gray-400">{product.material}</p>

            <div className="flex items-center space-x-4">
              {product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-lg">PKR {product.originalPrice}</span>
              )}
              <span className="text-2xl font-bold text-white">PKR {product.price}</span>
              {discountPercentage > 0 && (
                <span className="bg-gradient-to-br from-gray-900 to-black text-white text-sm font-semibold px-2 py-1 rounded-full border border-gray-700">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium text-white">Color: {selectedColor}</h3>
                <div className="flex space-x-2">
                  {product.color.map((color, index) => (
                    <button 
                      key={index} 
                      className={`h-8 w-8 rounded-full ${
                        selectedColor === color ? 'ring-2 ring-gray-400' : 'ring-1 ring-gray-600'
                      }`}
                      style={{ backgroundColor: getColorClass(color) }} // Apply color directly
                      aria-label={color}
                      onClick={() => setSelectedColor(color)}
                    ></button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-white">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((size, index) => (
                    <button
                      key={index}
                      className={`flex h-10 w-10 items-center justify-center rounded-none border ${
                        selectedSize === size ? 'border-gray-200 bg-gray-800' : 'border-gray-700 bg-gradient-to-br from-gray-900 to-black'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="mt-2 flex items-center text-gray-200">
                  <RulerIcon className="mr-1 h-4 w-4" />
                  <span>Size Guide</span>
                </button>
              </div>
            </div>

            {discountPercentage > 0 && (
              <div className="flex items-center">
                <span className="mr-2 flex h-3 w-3 rounded-full bg-gray-200"></span>
                <span className="text-gray-200">Discount applied in cart.</span>
              </div>
            )}
             <div className="flex items-center">
              <span className="mr-2 flex h-3 w-3 rounded-full bg-gray-200"></span>
              <span className="text-gray-200">Free Home Delivery</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 flex h-3 w-3 rounded-full bg-gray-200"></span>
              <span className="text-gray-200">30-Day Money-Back Guarantee.</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 flex h-3 w-3 rounded-full bg-gray-200"></span>
              <span className="text-gray-200">Quality Assurance Warranty.</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 flex h-3 w-3 rounded-full bg-gray-200"></span>
              <span className="text-gray-200">Trusted by Thousands of Happy Customers.</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-700 bg-gradient-to-br from-gray-900 to-black">
                <button 
                  className="p-3 text-gray-400 hover:text-white"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-white">{quantity}</span>
                <button 
                  className="p-3 text-gray-400 hover:text-white"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Link 
                href={{
                  pathname: `/checkout/${slug}`,
                  query: { 
                    imageUrl: selectedImageUrl,
                    productTitle: product.title,
                    price: product.price,
                    color: selectedColor, 
                    size: selectedSize, 
                    quantity: quantity
                  }
                }}
                className={`w-full py-4 text-center font-medium text-white ${
                  product.isInStock 
                    ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1' 
                    : 'bg-gray-700 cursor-not-allowed'
                } transition-all duration-300`}
                disabled={!product.isInStock}
              >
                {product.isInStock ? 'Buy Now' : 'OUT OF STOCK'}
              </Link>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="border-t border-gray-800 pt-4">
                <h3 className="font-medium text-white mb-2">Available Variants</h3>
                <div className="space-y-2">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="flex justify-between items-center border border-gray-800 p-2 bg-gradient-to-br from-gray-900 to-black">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: getColorClass(variant.color) }} // Apply variant color directly
                        ></div>
                        <span className="text-white">{variant.color}, {variant.size}</span>
                      </div>
                      <div className="text-gray-400">
                        {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                      </div>
                      <div className="text-gray-200 font-medium">
                        PKR {variant.price || product.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 mt-4">
          <div className="flex border-b border-gray-800">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'description' ? 'text-gray-200 border-b-2 border-gray-200' : 'text-gray-400'}`}
              onClick={() => setActiveTab('description')}
            >
              DESCRIPTION
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-gray-200 border-b-2 border-gray-200' : 'text-gray-400'}`}
              onClick={() => setActiveTab('details')}
            >
              DETAILS
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'specifications' ? 'text-gray-200 border-b-2 border-gray-200' : 'text-gray-400'}`}
              onClick={() => setActiveTab('specifications')}
            >
              SPECIFICATIONS
            </button>
          </div>
          
          {activeTab === 'description' && (
            <div className="mt-4 text-gray-300">
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{product.category}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Brand:</span>
                  <span className="text-white">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Gender:</span>
                  <span className="text-white capitalize">{product.gender}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Season:</span>
                  <span className="text-white capitalize">{product.season || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Occasion:</span>
                  <span className="text-white capitalize">{product.occasion || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Stock:</span>
                  <span className="text-white">{product.stock}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Sold:</span>
                  <span className="text-white">{product.soldCount}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Tags:</span>
                  <span className="text-white">{product.tags.length > 0 ? product.tags.join(', ') : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Material:</span>
                  <span className="text-white">{product.material}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Fit:</span>
                  <span className="text-white capitalize">{product.fit || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Sleeve Length:</span>
                  <span className="text-white capitalize">{product.sleeveLength || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Pattern:</span>
                  <span className="text-white capitalize">{product.pattern || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-white">{product.weight ? `${product.weight} g` : 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Colors Available:</span>
                  <span className="text-white">{product.color.join(', ')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Sizes Available:</span>
                  <span className="text-white">{product.size.join(', ')}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Care Instructions:</span>
                  <span className="text-white">{product.careInstructions || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {product.discount > 0 && (
          <div className="fixed bottom-0 left-0 bg-gradient-to-r from-gray-900 to-black p-4 text-white w-full">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-200">Get {product.discount}% Off on this product!</span>
              <button className="text-gray-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}