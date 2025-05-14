/* eslint-disable react/no-unescaped-entities */
"use client";
import Categories from "./Components/Home/Categories";
import FeaturedProducts from "./Components/Home/FeaturedProducts";
import RecentProducts from "./Components/Home/RecentProducts";
import SpecialOffers from "./Components/Home/SpecialOffers";

export default function Home() {
  return (
    <div className="bg-gray-950 text-gray-100 overflow-x-hidden font-sans">
      {/* Categories  */}
      <Categories />
      {/* Featured Products  */}
      <FeaturedProducts/>
      {/* Special Offers  */}
      <SpecialOffers/>
      {/* Recent Product  */}
      <RecentProducts/>
    </div>
  );
}