"use client";

import { useState, useEffect } from 'react';

export default function EditProductForm({ product, onProductUpdated }) {
  const [formData, setFormData] = useState({
    id: product._id || '',
    imageUrl: product.images?.[0]?.url || '',
    slug: product.slug || '',
    title: product.title || '',
    description: product.description || '',
    price: product.price || '',
    originalPrice: product.originalPrice || '',
    color: (product.color || []).join(',') || '',
    size: (product.size || []).join(',') || '',
    category: product.category || '',
    material: product.material || '',
    brand: product.brand || '',
    stock: product.stock || '',
    discount: product.discount || '',
    gender: product.gender || '',
    fit: product.fit || '',
    sleeveLength: product.sleeveLength || '',
    pattern: product.pattern || '',
    careInstructions: product.careInstructions || '',
    weight: product.weight || '',
    tags: (product.tags || []).join(',') || '',
    season: product.season || '',
    occasion: product.occasion || '',
    starred: product.starred || false,
    ratings: product.ratings || '',
    reviews: product.reviews || '',
    isInStock: product.isInStock || true,
    soldCount: product.soldCount || '',
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      id: product._id || '',
      imageUrl: product.images?.[0]?.url || '',
      slug: product.slug || '',
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      color: (product.color || []).join(',') || '',
      size: (product.size || []).join(',') || '',
      category: product.category || '',
      material: product.material || '',
      brand: product.brand || '',
      stock: product.stock || '',
      discount: product.discount || '',
      gender: product.gender || '',
      fit: product.fit || '',
      sleeveLength: product.sleeveLength || '',
      pattern: product.pattern || '',
      careInstructions: product.careInstructions || '',
      weight: product.weight || '',
      tags: (product.tags || []).join(',') || '',
      season: product.season || '',
      occasion: product.occasion || '',
      starred: product.starred || false,
      ratings: product.ratings || '',
      reviews: product.reviews || '',
      isInStock: product.isInStock || true,
      soldCount: product.soldCount || '',
    });
  }, [product]);

  useEffect(() => {
    if (files.length > 0) {
      const fileName = files[0].name.replace(/\.[^/.]+$/, '');
      const title = fileName
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      const slug = fileName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

      setFormData((prev) => ({
        ...prev,
        title: prev.title || title,
        slug: prev.slug || slug,
      }));
    }
  }, [files]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleDeleteImage = () => {
    setFiles([]);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append('id', formData.id);
      if (files.length > 0) {
        files.forEach((file) => data.append('images', file));
      }
      data.append('imageUrl', formData.imageUrl);
      data.append('slug', formData.slug);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('originalPrice', formData.originalPrice);
      data.append('color', formData.color);
      data.append('size', formData.size);
      data.append('category', formData.category);
      data.append('material', formData.material);
      data.append('brand', formData.brand);
      data.append('stock', formData.stock);
      data.append('discount', formData.discount);
      data.append('gender', formData.gender);
      data.append('fit', formData.fit);
      data.append('sleeveLength', formData.sleeveLength);
      data.append('pattern', formData.pattern);
      data.append('careInstructions', formData.careInstructions);
      data.append('weight', formData.weight);
      data.append('tags', formData.tags);
      data.append('season', formData.season);
      data.append('occasion', formData.occasion);
      data.append('starred', formData.starred);
      data.append('ratings', formData.ratings);
      data.append('reviews', formData.reviews);
      data.append('isInStock', formData.isInStock);
      data.append('soldCount', formData.soldCount);

      const res = await fetch('/api/editProduct', { method: 'PUT', body: data });
      const dataRes = await res.json();
      if (!res.ok) throw new Error(dataRes.error || 'Failed to update product');
      setMessage({ type: 'success', text: 'Product updated successfully!' });
      onProductUpdated();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Edit Product</h3>
      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-200 mb-2">
            Upload New Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            multiple
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-200 mb-2">
              Or Enter New Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter image URL"
              disabled={loading || files.length > 0}
            />
          </div>
          {(formData.imageUrl || product.images?.length > 0) && !files.length && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="p-3 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-300"
              disabled={loading}
            >
              Delete Image
            </button>
          )}
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
            Title (Auto-generated from first image, editable)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Title will auto-generate from first image"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter product description"
            required
            disabled={loading}
            rows="4"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter price"
            required
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-200 mb-2">
            Original Price (optional)
          </label>
          <input
            type="number"
            id="originalPrice"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter original price"
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-200 mb-2">
            Colors (comma-separated, e.g., red,blue,green)
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter colors (e.g., red,blue,green)"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-200 mb-2">
            Sizes (comma-separated, e.g., S,M,L)
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter sizes (e.g., S,M,L)"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            disabled={loading}
          >
            <option value="">Select category</option>
            <option value="Anime">Anime</option>
            <option value="Casual">Casual</option>
            <option value="Memes">Memes</option>
            <option value="Trending">Trending</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-200 mb-2">
            Material
          </label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter material (e.g., cotton, polyester)"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-200 mb-2">
            Brand (optional)
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter brand name"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-200 mb-2">
            Stock (optional)
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter stock quantity"
            min="0"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-200 mb-2">
            Discount (%) (optional)
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter discount percentage"
            min="0"
            max="100"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-200 mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            disabled={loading}
          >
            <option value="">Select gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label htmlFor="fit" className="block text-sm font-medium text-gray-200 mb-2">
            Fit (optional)
          </label>
          <select
            id="fit"
            name="fit"
            value={formData.fit}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={loading}
          >
            <option value="">Select fit</option>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="loose">Loose</option>
          </select>
        </div>
        <div>
          <label htmlFor="sleeveLength" className="block text-sm font-medium text-gray-200 mb-2">
            Sleeve Length (optional)
          </label>
          <select
            id="sleeveLength"
            name="sleeveLength"
            value={formData.sleeveLength}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={loading}
          >
            <option value="">Select sleeve length</option>
            <option value="short sleeve">Short Sleeve</option>
            <option value="long sleeve">Long Sleeve</option>
            <option value="sleeveless">Sleeveless</option>
          </select>
        </div>
        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-gray-200 mb-2">
            Pattern (optional)
          </label>
          <select
            id="pattern"
            name="pattern"
            value={formData.pattern}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={loading}
          >
            <option value="">Select pattern</option>
            <option value="solid">Solid</option>
            <option value="striped">Striped</option>
            <option value="checkered">Checkered</option>
            <option value="printed">Printed</option>
          </select>
        </div>
        <div>
          <label htmlFor="careInstructions" className="block text-sm font-medium text-gray-200 mb-2">
            Care Instructions (optional)
          </label>
          <input
            type="text"
            id="careInstructions"
            name="careInstructions"
            value={formData.careInstructions}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter care instructions (e.g., machine washable)"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-200 mb-2">
            Weight (grams) (optional)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter weight in grams"
            min="0"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-200 mb-2">
            Tags (comma-separated, e.g., casual,formal,summer) (optional)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter tags (e.g., casual,formal,summer)"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-200 mb-2">
            Season (optional)
          </label>
          <select
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={loading}
          >
            <option value="">Select season</option>
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
            <option value="spring">Spring</option>
            <option value="fall">Fall</option>
            <option value="all seasons">All Seasons</option>
          </select>
        </div>
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-gray-200 mb-2">
            Occasion (optional)
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={loading}
          >
            <option value="">Select occasion</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
            <option value="sportswear">Sportswear</option>
          </select>
        </div>
        <div>
          <label htmlFor="ratings" className="block text-sm font-medium text-gray-200 mb-2">
            Ratings (0-5) (optional)
          </label>
          <input
            type="number"
            id="ratings"
            name="ratings"
            value={formData.ratings}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter ratings (0-5)"
            min="0"
            max="5"
            step="0.1"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="reviews" className="block text-sm font-medium text-gray-200 mb-2">
            Reviews (optional)
          </label>
          <input
            type="number"
            id="reviews"
            name="reviews"
            value={formData.reviews}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter number of reviews"
            min="0"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="isInStock" className="block text-sm font-medium text-gray-200 mb-2">
            In Stock
          </label>
          <input
            type="checkbox"
            id="isInStock"
            name="isInStock"
            checked={formData.isInStock}
            onChange={handleChange}
            className="mr-2 leading-tight"
            disabled={loading}
          />
          <span className="text-gray-300">Check if in stock</span>
        </div>
        <div>
          <label htmlFor="starred" className="block text-sm font-medium text-gray-200 mb-2">
            Starred
          </label>
          <input
            type="checkbox"
            id="starred"
            name="starred"
            checked={formData.starred}
            onChange={handleChange}
            className="mr-2 leading-tight"
            disabled={loading}
          />
          <span className="text-gray-300">Feature this product</span>
        </div>
        <div>
          <label htmlFor="soldCount" className="block text-sm font-medium text-gray-200 mb-2">
            Sold Count (optional)
          </label>
          <input
            type="number"
            id="soldCount"
            name="soldCount"
            value={formData.soldCount}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter sold count"
            min="0"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-200 mb-2">
            Slug (Auto-generated from first image, editable)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Slug will auto-generate from first image"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full p-3 rounded font-medium text-base text-white transition-all duration-300 ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-1'
          }`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}