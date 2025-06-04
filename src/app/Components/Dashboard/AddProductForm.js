"use client";

import { useState } from "react";

export default function AddProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    price: "",
    originalPrice: "",
    color: "",
    size: "",
    category: "",
    material: "",
    brand: "",
    stock: "",
    discount: "",
    gender: "",
    fit: "",
    sleeveLength: "",
    pattern: "",
    careInstructions: "",
    weight: "",
    tags: "",
    season: "",
    occasion: "",
    ratings: "",
    reviews: "",
    isInStock: true,
    starred: false,
    soldCount: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);

    // Auto-fill fields based on the first image's file name
    if (selectedImages.length > 0) {
      const fileName = selectedImages[0].name.split('.')[0]; // Remove extension
      const title = fileName
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '); // Capitalize each word
      const slug = fileName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); // Create slug
      const tags = fileName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, ','); // Extract tags

      setFormData((prev) => ({
        ...prev,
        title: prev.title || title, // Only set if not already filled
        slug: prev.slug || slug,
        tags: prev.tags || tags,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    images.forEach((image) => data.append("images", image));
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "color" || key === "size" || key === "tags") {
        data.append(key, value.split(",").map((item) => item.trim()));
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch("/api/addProduct", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add product");

      setFormData({
        title: "",
        description: "",
        slug: "",
        price: "",
        originalPrice: "",
        color: "",
        size: "",
        category: "",
        material: "",
        brand: "",
        stock: "",
        discount: "",
        gender: "",
        fit: "",
        sleeveLength: "",
        pattern: "",
        careInstructions: "",
        weight: "",
        tags: "",
        season: "",
        occasion: "",
        ratings: "",
        reviews: "",
        isInStock: true,
        starred: false,
        soldCount: "",
      });
      setImages([]);
      if (onProductAdded) onProductAdded();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-white/10">
      <h3 className="text-2xl font-semibold text-white mb-4">Add New Product</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300">Images *</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
         <div>
          <label className="block text-gray-300">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-300">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-gray-300">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
          />
        </div>
        <div>
          <label className="block text-gray-300">Colors (comma-separated) *</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Sizes (comma-separated) *</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          >
            <option value="">Select Category</option>
            <option value="Anime">Anime</option>
            <option value="Trending">Trending</option>
            <option value="Casual">Casual</option>
            <option value="Memes">Memes</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Material *</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-300">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
          />
        </div>
        <div>
          <label className="block text-gray-300">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="block text-gray-300">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Fit</label>
          <select
            name="fit"
            value={formData.fit}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          >
            <option value="">Select Fit</option>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="loose">Loose</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Sleeve Length</label>
          <select
            name="sleeveLength"
            value={formData.sleeveLength}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          >
            <option value="">Select Sleeve Length</option>
            <option value="short sleeve">Short Sleeve</option>
            <option value="long sleeve">Long Sleeve</option>
            <option value="sleeveless">Sleeveless</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Pattern</label>
          <select
            name="pattern"
            value={formData.pattern}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          >
            <option value="">Select Pattern</option>
            <option value="solid">Solid</option>
            <option value="striped">Striped</option>
            <option value="checkered">Checkered</option>
            <option value="printed">Printed</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Care Instructions</label>
          <input
            type="text"
            name="careInstructions"
            value={formData.careInstructions}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-300">Weight (grams)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
          />
        </div>
        <div>
          <label className="block text-gray-300">Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          >
            <option value="">Select Season</option>
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
            <option value="spring">Spring</option>
            <option value="fall">Fall</option>
            <option value="all seasons">All Seasons</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Occasion</label>
          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
          >
            <option value="">Select Occasion</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
            <option value="sportswear">Sportswear</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Ratings (0-5)</label>
          <input
            type="number"
            name="ratings"
            value={formData.ratings}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
            max="5"
          />
        </div>
        <div>
          <label className="block text-gray-300">Reviews</label>
          <input
            type="number"
            name="reviews"
            value={formData.reviews}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
          />
        </div>
        <div>
          <label className="block text-gray-300">In Stock</label>
          <input
            type="checkbox"
            name="isInStock"
            checked={formData.isInStock}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <span className="text-gray-300">Check if in stock</span>
        </div>
        <div>
          <label className="block text-gray-300">Starred</label>
          <input
            type="checkbox"
            name="starred"
            checked={formData.starred}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <span className="text-gray-300">Feature this product</span>
        </div>
        <div>
          <label className="block text-gray-300">Sold Count</label>
          <input
            type="number"
            name="soldCount"
            value={formData.soldCount}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white border border-white/20 rounded p-2"
            min="0"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-all duration-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}