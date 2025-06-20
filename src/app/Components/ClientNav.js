/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchResultsRef = useRef([]);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [isGiveawaysLocked, setIsGiveawaysLocked] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

    const fetchLockStatus = async () => {
      try {
        const res = await fetch("/api/giveawaylock");
        const data = await res.json();
        setIsGiveawaysLocked(data.isLocked);
      } catch (error) {
        console.error("Error fetching lock status:", error);
      }
    };
    fetchLockStatus();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
      setIsSearchDropdownOpen(false);
      setFocusedIndex(-1);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setIsSearchDropdownOpen(true);
    setFocusedIndex(-1);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      if (href?.startsWith("#")) {
        const sectionId = href.slice(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
      }
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => link.addEventListener("click", handleSmoothScroll));
    return () => anchorLinks.forEach((link) => link.removeEventListener("click", handleSmoothScroll));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      if (focusedIndex >= 0 && filteredProducts[focusedIndex]) {
        router.push(`/shop/${filteredProducts[focusedIndex].slug}`);
        setSearchQuery("");
        setIsSearchDropdownOpen(false);
        setIsMobileMenuOpen(false);
        setFocusedIndex(-1);
      } else {
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setIsSearchDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    } else if (e.key === "ArrowDown" && isSearchDropdownOpen && filteredProducts.length > 0) {
      e.preventDefault();
      const nextIndex = focusedIndex < filteredProducts.length - 1 ? focusedIndex + 1 : 0;
      setFocusedIndex(nextIndex);
      if (searchResultsRef.current[nextIndex]) {
        searchResultsRef.current[nextIndex].focus();
        searchResultsRef.current[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } else if (e.key === "ArrowUp" && isSearchDropdownOpen && filteredProducts.length > 0) {
      e.preventDefault();
      const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredProducts.length - 1;
      setFocusedIndex(prevIndex);
      if (searchResultsRef.current[prevIndex]) {
        searchResultsRef.current[prevIndex].focus();
        searchResultsRef.current[prevIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } else if (e.key === "Escape") {
      setIsSearchDropdownOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleSearchResultClick = (slug, e) => {
    e.stopPropagation();
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    setIsMobileMenuOpen(false);
    router.push(`/shop/${slug}`);
  };

  const categories = ["Anime", "Casual", "Trending", "Memes", "Sports"];

  const handleGiveawaysClick = (e) => {
    if (isGiveawaysLocked) {
      e.preventDefault();
      alert("Giveaway coming soon. Please check back later!");
    }
  };

  return (
    <>
      <nav className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-4 py-4 fixed top-0 z-50 bg-black border-b border-white/20 shadow-[0_4px_10px_rgba(17,24,39,0.5)] font-sans">
        <Link href="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hover:scale-105 transition-transform duration-300 hidden md:block">
          CDU
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search..."
              className="w-60 bg-gradient-to-br from-gray-900 to-black text-white placeholder-white/50 border border-white/20 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:shadow-lg shadow-[0_0_10px_rgba(255,255,255,0.2)] text-sm min-h-[40px]"
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
            {isSearchDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-lg shadow-lg z-50 hover:shadow-xl transition-all duration-300 transform origin-top"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={(e) => handleSearchResultClick(product.slug, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchResultClick(product.slug, e);
                      }}
                      ref={(el) => (searchResultsRef.current[index] = el)}
                      className={`block px-4 py-2 text-white hover:bg-white/10 hover:shadow-md transition-all duration-200 flex items-center gap-3 cursor-pointer ${focusedIndex === index ? "bg-white/10" : ""}`}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={product.images[0]?.url || "https://via.placeholder.com/50x50?text=No+Image"}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.title}</p>
                        <p className="text-xs text-gray-400">Tags: {product.tags.join(", ")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400 text-sm">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <Link
            href="/shop"
            className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-sm uppercase tracking-widest relative group"
          >
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
          </Link>

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
                className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-lg shadow-lg z-50 hover:shadow-xl transition-all duration-300 transform origin-top"
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

          <Link
            href="/giveaways"
            onClick={handleGiveawaysClick}
            className={`text-white hover:text-gray-300 transition-all duration-300 font-medium text-sm uppercase tracking-widest relative group flex items-center ${isGiveawaysLocked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Giveaways
            {isGiveawaysLocked && (
              <svg
                className="ml-1 w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm0 10a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
          </Link>

          <a
            href="https://wa.me/923457778536?text=Hi%20CDU,%20I%27m%20interested%20in%20your%20t-shirt%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-gray-900 to-black text-white px-4 py-2 rounded-md font-medium text-sm border border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Chat
          </a>
        </div>

        <div className="md:hidden flex flex-col items-center w-full">
          <div className="flex items-center justify-between w-full mb-2">
            <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hover:scale-105 transition-transform duration-300">
              CDU
            </Link>
            <div className="flex items-center space-x-2">
              <a
                href="https://wa.me/923457778536?text=Hi%20CDU,%20I%27m%20interested%20in%20your%20t-shirt%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-gray-900 to-black text-white px-3 py-2 rounded-md font-medium text-sm border border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
              <button
                className="text-white hover:text-gray-300 transition-all duration-300 bg-gradient-to-br from-gray-900 to-black px-3 py-2 rounded-md hover:shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
            </div>
          </div>
          <div className="relative w-full" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search..."
              className="w-full bg-gradient-to-br from-gray-900 to-black text-white placeholder-white/50 border border-white/20 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:shadow-lg shadow-[0_0_10px_rgba(255,255,255,0.2)] text-sm min-h-[40px]"
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
            {isSearchDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-lg shadow-lg z-50 hover:shadow-xl transition-all duration-300 transform origin-top"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={(e) => handleSearchResultClick(product.slug, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchResultClick(product.slug, e);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      ref={(el) => (searchResultsRef.current[index] = el)}
                      className={`block px-4 py-2 text-white hover:bg-white/10 hover:shadow-md transition-all duration-200 flex items-center gap-3 cursor-pointer ${focusedIndex === index ? "bg-white/10" : ""}`}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={product.images[0]?.url || "https://via.placeholder.com/50x50?text=No+Image"}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.title}</p>
                        <p className="text-xs text-gray-400">Tags: {product.tags.join(", ")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400 text-sm">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className={`fixed top-[92px] left-0 w-full h-auto min-h-fit bg-black z-40 md:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-y-0" : "translate-y-[-100%]"}`}
        >
          <div className="flex flex-col items-center gap-6 px-4 py-12">
            <Link
              href="/shop"
              className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-lg uppercase tracking-widest relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="text-white hover:text-gray-300 transition-all duration-300 font-medium text-lg uppercase tracking-widest flex items-center bg-gradient-to-br from-gray-900 to-black px-4 py-2 rounded-md hover:shadow-lg"
              >
                Category
                <svg
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
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
                      className="text-white hover:text-gray-300 transition-all duration-200 text-sm bg-gradient-to-br from-gray-900 to-black px-4 py-2 rounded-md hover:bg-white/10 hover:shadow-md w-40 text-center"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/giveaways"
              onClick={handleGiveawaysClick}
              className={`text-white hover:text-gray-300 transition-all duration-300 font-medium text-lg uppercase tracking-widest relative group flex items-center ${isGiveawaysLocked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Giveaways
              {isGiveawaysLocked && (
                <svg
                  className="ml-1 w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm0 10a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-white group-hover:w-full transition-all duration-300" />
            </Link>

            <a
              href="https://wa.me/923457778536?text=Hi%20CDU,%20I%27m%20interested%20in%20your%20t-shirt%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-gray-900 to-black text-white px-4 py-2 rounded-md font-medium text-base border border-white/20 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-105 flex items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Chat
            </a>
          </div>
        </div>
      )}
    </>
  );
}