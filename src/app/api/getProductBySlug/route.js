import { connectionStr } from '@/utils/db';
import { Product } from '@/utils/models/product';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const product = await Product.findOne({ slug: { $regex: new RegExp(slug, 'i') } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productData = {
      ...product.toObject(),
      image: product.image || { url: '' },
    };

    return NextResponse.json({ product: productData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}