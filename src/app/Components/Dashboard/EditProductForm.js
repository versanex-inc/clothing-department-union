"use client";

import { useState, useEffect } from 'react';

export default function EditProductForm({ product, onProductUpdated }) {
  const [formData, setFormData] = useState({
    id: product._id || '',
    imageUrl: product.image?.url || '',
    slug: product.slug || '',
    title: product.title || '',
    productNumber: product.productNumber || '',
    carName: product.carName || '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      id: product._id || '',
      imageUrl: product.image?.url || '',
      slug: product.slug || '',
      title: product.title || '',
      productNumber: product.productNumber || '',
      carName: product.carName || '',
    });
  }, [product]);

  // Auto-generate title and slug from image filename
  useEffect(() => {
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setFormData((prev) => ({
        ...prev,
        title: fileName,
        slug: fileName
          .toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/[^a-z0-9-]/g, '') // Remove special characters
          .replace(/-+/g, '-'), // Replace multiple hyphens with a single hyphen
      }));
    } else if (!file && !formData.imageUrl) {
      setFormData((prev) => ({ ...prev, title: '', slug: '' }));
    }
  }, [file, formData.imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDeleteImage = () => {
    setFile(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (file) {
        const data = new FormData();
        data.append('id', formData.id);
        data.append('image', file);
        data.append('imageUrl', formData.imageUrl);
        data.append('slug', formData.slug);
        data.append('title', formData.title);
        data.append('productNumber', formData.productNumber);
        data.append('carName', formData.carName);

        console.log('Sending FormData:');
        for (let pair of data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        const res = await fetch('/api/editProduct', { method: 'PUT', body: data });
        const dataRes = await res.json();
        if (!res.ok) throw new Error(dataRes.error || 'Failed to update product');
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        const res = await fetch('/api/editProduct', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const dataRes = await res.json();
        if (!res.ok) throw new Error(dataRes.error || 'Failed to update product');
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      }

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
          <label htmlFor="image" className="block text-sm font-medium text-gray-200 mb-2">
            Upload New Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
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
              disabled={loading || file}
            />
          </div>
          {formData.imageUrl && !file && (
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
            Title (Auto-generated from image, editable)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Title will auto-generate from image"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="productNumber" className="block text-sm font-medium text-gray-200 mb-2">
            Product Number
          </label>
          <input
            type="number"
            id="productNumber"
            name="productNumber"
            value={formData.productNumber}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter product number"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="carName" className="block text-sm font-medium text-gray-200 mb-2">
            Car Name
          </label>
          <input
            type="text"
            id="carName"
            name="carName"
            value={formData.carName}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter car name"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-200 mb-2">
            Slug (Auto-generated from image, editable)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Slug will auto-generate from image"
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