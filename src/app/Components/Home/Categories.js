"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Categories() {
  const categories = ["Anime", "Casual", "Trending", "Memes", "Sports"];

  useEffect(() => {
    // Only run on client side
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
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <section id="categories" className="w-full py-12 bg-black text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 uppercase tracking-wider animate-fade-in text-gray-100">
          Discover Our T-Shirt Collections
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              href={`#categories?filter=${category.toLowerCase()}`}
              className="group relative w-full h-24 sm:h-28 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-base sm:text-lg font-medium uppercase tracking-tight text-gray-200 group-hover:text-white transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}