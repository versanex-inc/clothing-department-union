import { connectionStr } from '@/utils/db';
import { Product } from '@/utils/models/product';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!connectionStr) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr);
    }

    const products = await Product.find({ starred: true }).sort({ createdAt: -1 });

    // Convert Mongoose documents to plain objects to ensure all fields are included
    const productData = products.map(product => product.toObject());

    return NextResponse.json({ products: productData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching starred products:', error);
    return NextResponse.json({ error: 'Failed to fetch starred products' }, { status: 500 });
  }
}