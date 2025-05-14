"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    // Update category from URL hash
    const hash = window.location.hash.replace("#", "");
    if (hash && ["Anime", "Casual", "Trending", "Memes", "Sports"].includes(hash)) {
      setCategory(hash);
    }
  }, []);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    window.location.hash = cat;
  };

  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  useEffect(() => {
    // Only run on client side for animation
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <main className="w-full bg-black text-white min-h-screen">
      {/* Categories Section */}
      <section id="categories" className="w-full py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 uppercase tracking-wider animate-fade-in text-gray-100">
            Explore Our T-Shirt Collections
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 justify-center">
            {["Anime", "Casual", "Trending", "Memes", "Sports"].map((cat) => (
              <Link
                key={cat}
                href={`/shop/#${cat}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(cat);
                }}
                className="group relative w-full h-24 sm:h-28 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-base sm:text-lg font-medium uppercase tracking-tight text-gray-200 group-hover:text-white transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                  {cat}
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="w-full py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 uppercase tracking-wider animate-fade-in text-gray-100">
            {category ? `${category} Products` : "All Products"}
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-gray-200 mx-auto shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
                <p className="text-gray-200 mt-4 uppercase tracking-wide text-base">Loading Products...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/shop/${product.slug}`}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 w-full max-w-xs"
                >
                  <div className="w-full h-64 sm:h-72">
                    <img
                      src={product.images[0]?.url || "https://via.placeholder.com/300x400?text=No+Image"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-base sm:text-lg font-medium uppercase tracking-tight text-gray-200 group-hover:text-white transition-colors duration-300">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex justify-center items-center gap-2">
                      <p className="text-gray-200 text-base font-semibold">PKR {product.price}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-gray-500 line-through text-sm">PKR {product.originalPrice}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Add Buy Now logic here (e.g., add to cart or redirect to checkout)
                        alert(`Buying ${product.title} now!`);
                      }}
                      className="mt-3 w-full px-6 py-2 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-full font-medium text-sm text-gray-200 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-200 text-center text-base">No products available.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ShopPage;