import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/getProducts');
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const starredProducts = data.products.filter(product => product.starred === true);
        setFeaturedProducts(starredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-white text-center py-12">Loading...</div>;
  if (error) return <div className="text-white text-center py-12">Error: {error}</div>;

  const handleProductClick = (slug) => {
    router.push(`/shop/${slug}`);
  };

  return (
    <section className="w-full py-12 bg-black text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 uppercase tracking-wider animate-fade-in text-gray-100">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div
                key={product._id}
                className="group w-full bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => handleProductClick(product.slug)}
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-200">No Image Available</span>
                  </div>
                )}
                <div className="p-4 text-center">
                  <span className="block text-base sm:text-lg font-medium uppercase tracking-tight text-gray-200 group-hover:text-white transition-colors duration-300">
                    {product.title}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-200 text-center">No starred products available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;