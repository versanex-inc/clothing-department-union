"use client"
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 text-center">
        {/* Brand Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider uppercase mb-4 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
            ClothCraft
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in">
          Crafting Your Style, One Thread at a Time
        </p>

        {/* Order Confirmation Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8 shadow-lg mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-white uppercase mb-4">
            Thank You for Your Order!
          </h2>
          <p className="text-gray-200 mb-6 max-w-md mx-auto">
            Your order has been placed successfully. We’ll deliver your ClothCraft product soon via Cash on Delivery. Stay tuned for updates!
          </p>
          <Link
            href="/shop"
            className="inline-block py-3 px-8 text-center font-medium text-white bg-gradient-to-br from-gray-800 to-black border border-gray-600 rounded-full hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Social Media Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8 shadow-lg mb-8 animate-fade-in">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-4">
            Join the ClothCraft Community!
          </h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Follow us on social media for the latest fashion trends, exclusive deals, and styling tips. Be the first to know about new arrivals and get 10% off your next purchase when you follow us!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="flex gap-4">
              <a
                href="https://facebook.com/clothcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/clothcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@clothcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black hover:scale-110 transition-all duration-300"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 3.163 6.33 6.33 0 0 0-.127 6.463 6.33 6.33 0 0 0 11.08.747V9.987a8.316 8.316 0 0 0 3.668 1V7.543a4.792 4.792 0 0 1-1.994-.857z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@clothcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
            <a
              href="https://wa.me/923457778536?text=Hi%20ClothCraft,%20I%27m%20interested%20in%20your%20t-shirt%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-gray-900 to-black text-white px-6 py-2 rounded-full font-medium text-base border border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 flex items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              aria-label="WhatsApp Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Chat with Us
            </a>
          </div>
        </div>

        {/* Additional CTAs */}
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Explore More Styles
            </h3>
            <p className="text-gray-400 mb-4">
              Discover our trending collections and find your next favorite outfit! Use code <span className="text-white font-semibold">CRAFT10</span> for 10% off your next purchase.
            </p>
            <Link
              href="/shop#Trending"
              className="inline-block py-2 px-6 text-center font-medium text-white bg-gradient-to-br from-gray-800 to-black border border-gray-600 rounded-full hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300"
            >
              Shop Trending
            </Link>
          </div>
        </div>

        {/* Share Prompt */}
        <p className="mt-8 text-gray-300 animate-fade-in">
          Loved your purchase? Share it with us on social media using <span className="text-gray-200 font-semibold">#ClothCraftStyle</span>!
        </p>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-15px); }
          60% { transform: translateY(-7px); }
        }
        .animate-bounce {
          animation: bounce 1s;
        }
      `}</style>
    </div>
  );
}