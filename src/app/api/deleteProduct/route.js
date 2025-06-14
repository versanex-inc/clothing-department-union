import { connectionStr } from '@/utils/db';
import { Product } from '@/utils/models/product';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { deleteFile } from '@/utils/saveFile';
import jwt from 'jsonwebtoken';

export async function DELETE(request) {
  try {
    if (!connectionStr) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr);
    }

    const token = request.cookies.get('token')?.value;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Collect all image URLs to delete (from images array and variants)
    const imageUrls = [];

    // Add URLs from the images array
    if (product.images && product.images.length > 0) {
      const imageUrlsFromArray = product.images.map(image => image.url).filter(url => url);
      imageUrls.push(...imageUrlsFromArray);
    }

    // Add URLs from variants (if any)
    if (product.variants && product.variants.length > 0) {
      const variantImageUrls = product.variants
        .map(variant => variant.image?.url)
        .filter(url => url);
      imageUrls.push(...variantImageUrls);
    }

    // Delete all associated images
    if (imageUrls.length > 0) {
      deleteFile(imageUrls); // deleteFile now accepts an array of URLs
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}