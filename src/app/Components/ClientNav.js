/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ClientNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      if (href?.startsWith("#")) {
        const sectionId = href.slice(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Adjusted for nav height
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
        setIsMobileMenuOpen(false);
      }
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Add search functionality later (e.g., filter products based on query)
  };

  const categories = ["Anime", "Casual", "Trending", "Memes", "Sports"];

  return (
    <>
      <nav className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 py-5 fixed top-0 z-50 bg-black border-b border-white/10 shadow-[0_4px_10px_rgba(17,24,39,0.5)]">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-white hover:scale-105 transition-transform duration-300">
          ClothCraft
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="bg-gradient-to-br from-gray-900 to-black text-white placeholder-white/50 border border-white/20 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:shadow-lg shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Shop Link */}
          <Link
            href="/shop"
            className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-sm uppercase tracking-widest relative group"
          >
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Category Dropdown */}
          <div className="relative">
            <Link
              href="#categories"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
              className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-sm uppercase tracking-widest relative group"
            >
              Category
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
            </Link>
            {isCategoryOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-lg shadow-lg z-50 hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/shop/#${category}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/shop/#${category}`;
                      setIsCategoryOpen(false);
                    }}
                    className="block px-4 py-2 text-white hover:bg-white/10 hover:shadow-md transition-all duration-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/923457778536?text=Hi%20ClothCraft,%20I%27m%20interested%20in%20your%20t-shirt%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-gray-900 to-black text-white px-4 py-2 rounded-full font-medium text-sm border border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Chat
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-gray-300 transition-all duration-300 bg-gradient-to-br from-gray-900 to-black p-2 rounded-full hover:shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[80px] bg-black z-40 md:hidden">
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Search Bar (Mobile) */}
            <div className="relative w-3/4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full bg-gradient-to-br from-gray-900 to-black text-white placeholder-white/50 border border-white/20 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:shadow-lg shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Shop Link */}
            <Link
              href="/shop"
              className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-lg uppercase tracking-widest relative group"
            >
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Category Dropdown (Mobile) */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-lg uppercase tracking-widest flex items-center bg-gradient-to-br from-gray-900 to-black px-4 py-2 rounded-lg hover:shadow-lg"
              >
                Category
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCategoryOpen && (
                <div className="mt-2 flex flex-col items-center gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/shop/#${category}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/shop/#${category}`;
                        setIsCategoryOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-gray-300 transition-all duration-200 text-sm bg-gradient-to-br from-gray-900 to-black px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-md"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/923457778536?text=Hi%20ClothCraft,%20I%27m%20interested%20in%20your%20t-shirt%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-gray-900 to-black text-white px-6 py-2 rounded-full font-medium text-base border border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 flex items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Chat
            </a>
          </div>
        </div>
      )}
    </>
  );
}