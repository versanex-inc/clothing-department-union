import { connectionStr } from '@/utils/db';
import { Product } from '@/utils/models/product';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { saveFile, deleteFile } from '@/utils/saveFile';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No token found' }, { status: 401 });
    jwt.verify(token, process.env.JWT_SECRET);

    let imageUrl, slug, title, productNumber, carName, file;
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      file = formData.get('image');
      imageUrl = file ? await saveFile(file) : formData.get('imageUrl') || '';
      slug = formData.get('slug') || '';
      title = formData.get('title') || '';
      productNumber = formData.get('productNumber') || '';
      carName = formData.get('carName') || '';
    } else {
      const body = await request.json();
      imageUrl = body.imageUrl || '';
      slug = body.slug || '';
      title = body.title || '';
      productNumber = body.productNumber || '';
      carName = body.carName || '';
    }

    if (!imageUrl && !file || !slug || !title || !productNumber || !carName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newProduct = new Product({
      image: { url: imageUrl },
      slug,
      title,
      productNumber,
      carName,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json({ message: 'Product added successfully', product: savedProduct }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    if (error.code === 11000) return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    if (error.message.includes('Only images') || error.message.includes('File size')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}