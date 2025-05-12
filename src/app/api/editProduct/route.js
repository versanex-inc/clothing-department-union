import { connectionStr } from '@/utils/db';
import { Product } from '@/utils/models/product';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { saveFile, deleteFile } from '@/utils/saveFile';
import jwt from 'jsonwebtoken';

export async function PUT(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No token found' }, { status: 401 });
    jwt.verify(token, process.env.JWT_SECRET);

    let id, imageUrl, slug, title, productNumber, carName, file, starred;
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id');
      file = formData.get('image');
      imageUrl = file ? await saveFile(file) : formData.get('imageUrl') || '';
      slug = formData.get('slug') || '';
      title = formData.get('title') || '';
      productNumber = formData.get('productNumber') || '';
      carName = formData.get('carName') || '';
      starred = formData.get('starred') === 'true' || false;
    } else {
      const body = await request.json();
      id = body.id;
      imageUrl = body.imageUrl;
      slug = body.slug || '';
      title = body.title || '';
      productNumber = body.productNumber || '';
      carName = body.carName || '';
      starred = body.starred !== undefined ? body.starred : undefined;
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const oldImageUrl = existingProduct.image?.url || '';

    const updateData = {};
    const isImageUpdate = imageUrl !== undefined || file; // Check if image is being updated
    if (isImageUpdate) {
      if (!slug || !title || !productNumber || !carName) {
        return NextResponse.json({ error: 'All fields are required when updating image' }, { status: 400 });
      }
      updateData['image.url'] = imageUrl || '';
      if (oldImageUrl && (imageUrl !== oldImageUrl || imageUrl === '')) {
        deleteFile(oldImageUrl);
      }
    }
    if (slug) updateData.slug = slug;
    if (title) updateData.title = title;
    if (productNumber) updateData.productNumber = productNumber;
    if (carName) updateData.carName = carName;
    if (starred !== undefined) updateData.starred = starred;

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 11000) return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    if (error.message.includes('Only images') || error.message.includes('File size')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}