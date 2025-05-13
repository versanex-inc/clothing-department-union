"use client";

import { useState, useEffect } from 'react';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    imageUrl: '',
    slug: '',
    title: '',
    description: '',
    price: '',
    color: '',
    size: '',
    category: '',
    material: '',
    brand: '',
    stock: '',
    discount: '',
    gender: '',
    fit: '',
    sleeveLength: '',
    pattern: '',
    careInstructions: '',
    weight: '',
    tags: '',
    season: '',
    occasion: '',
  });
  const [files, setFiles] = useState([]); // Support multiple files
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-generate title and slug from the first image filename
  useEffect(() => {
    if (files.length > 0) {
      const fileName = files[0].name.replace(/\.[^/.]+$/, ''); // Remove extension from the first file
      setFormData((prev) => ({
        ...prev,
        title: fileName,
        slug: fileName
          .toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, '') // Remove special characters
          .replace(/-+/g, '-'), // Replace multiple hyphens with a single hyphen
      }));
    } else if (files.length === 0 && !formData.imageUrl) {
      setFormData((prev) => ({ ...prev, title: '', slug: '' }));
    }
  }, [files, formData.imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Convert FileList to array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const data = new FormData();
      // Append multiple files if they exist
      if (files.length > 0) {
        files.forEach((file) => {
          data.append('images', file); // Use 'images' to match API expectation
        });
      }
      // Append other form fields
      data.append('imageUrl', formData.imageUrl);
      data.append('slug', formData.slug);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('color', formData.color); // Comma-separated string
      data.append('size', formData.size); // Comma-separated string
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
      data.append('tags', formData.tags); // Comma-separated string
      data.append('season', formData.season);
      data.append('occasion', formData.occasion);

      console.log('Sending FormData:');
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await fetch('/api/addProduct', { method: 'POST', body: data });
      const dataRes = await res.json();
      if (!res.ok) throw new Error(dataRes.error || 'Failed to add product');
      setMessage({ type: 'success', text: 'Product added successfully!' });

      // Reset form
      setFormData({
        imageUrl: '',
        slug: '',
        title: '',
        description: '',
        price: '',
        color: '',
        size: '',
        category: '',
        material: '',
        brand: '',
        stock: '',
        discount: '',
        gender: '',
        fit: '',
        sleeveLength: '',
        pattern: '',
        careInstructions: '',
        weight: '',
        tags: '',
        season: '',
        occasion: '',
      });
      setFiles([]);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Add New Product</h3>
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
            Upload Images
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
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-200 mb-2">
            Or Enter Image URL (for single image)
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
            <option value="shirts">Shirts</option>
            <option value="t-shirts">T-Shirts</option>
            <option value="pants">Pants</option>
            <option value="jackets">Jackets</option>
            <option value="accessories">Accessories</option>
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
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}