/* eslint-disable react/no-unescaped-entities */
"use client";
import Categories from "./Components/Home/Categories";
import FeaturedProducts from "./Components/Home/FeaturedProducts";

export default function Home() {
  return (
    <div className="bg-gray-950 text-gray-100 overflow-x-hidden font-sans">
      {/* Categories  */}
      <Categories />
      {/* Featured Products  */}
      <FeaturedProducts/>
    </div>
  );
}