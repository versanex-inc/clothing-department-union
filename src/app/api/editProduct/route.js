import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectionStr } from '@/utils/db';
import { Product } from '@/utils/models/product';
import { deleteFile, saveFile } from '@/utils/saveFile';

export async function PUT(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'No token found' }, { status: 401 });
    jwt.verify(token, process.env.JWT_SECRET);

    let id, imageUrls = [], slug, title, description, price, originalPrice, colors, sizes, category, material, brand, stock, discount, gender, fit, sleeveLength, pattern, careInstructions, weight, tags, season, occasion, starred, ratings, reviews, isInStock, soldCount, files;
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id');
      files = formData.getAll('images');
      imageUrls = files.length > 0 ? await saveFile(files) : (formData.get('imageUrl') ? [formData.get('imageUrl')] : []);
      slug = formData.get('slug') || '';
      title = formData.get('title') || '';
      description = formData.get('description') || '';
      price = parseFloat(formData.get('price')) || undefined;
      originalPrice = parseFloat(formData.get('originalPrice')) || undefined;
      colors = formData.get('color') ? formData.get('color').split(',') : undefined;
      sizes = formData.get('size') ? formData.get('size').split(',') : undefined;
      category = formData.get('category') || '';
      material = formData.get('material') || '';
      brand = formData.get('brand') || '';
      stock = parseInt(formData.get('stock')) || undefined;
      discount = parseFloat(formData.get('discount')) || undefined;
      gender = formData.get('gender') || '';
      fit = formData.get('fit') || '';
      sleeveLength = formData.get('sleeveLength') || '';
      pattern = formData.get('pattern') || '';
      careInstructions = formData.get('careInstructions') || '';
      weight = parseFloat(formData.get('weight')) || undefined;
      tags = formData.get('tags') ? formData.get('tags').split(',') : undefined;
      season = formData.get('season') || '';
      occasion = formData.get('occasion') || '';
      starred = formData.get('starred') === 'true' || false;
      ratings = parseFloat(formData.get('ratings')) || undefined;
      reviews = parseInt(formData.get('reviews')) || undefined;
      isInStock = formData.get('isInStock') === 'true' || undefined;
      soldCount = parseInt(formData.get('soldCount')) || undefined;
    } else {
      const body = await request.json();
      id = body.id;
      imageUrls = body.imageUrl ? [body.imageUrl] : (body.imageUrls || []);
      slug = body.slug || '';
      title = body.title || '';
      description = body.description || '';
      price = body.price !== undefined ? parseFloat(body.price) : undefined;
      originalPrice = body.originalPrice !== undefined ? parseFloat(body.originalPrice) : undefined;
      colors = body.color || undefined;
      sizes = body.size || undefined;
      category = body.category || '';
      material = body.material || '';
      brand = body.brand || '';
      stock = body.stock !== undefined ? parseInt(body.stock) : undefined;
      discount = body.discount !== undefined ? parseFloat(body.discount) : undefined;
      gender = body.gender || '';
      fit = body.fit || '';
      sleeveLength = body.sleeveLength || '';
      pattern = body.pattern || '';
      careInstructions = body.careInstructions || '';
      weight = body.weight !== undefined ? parseFloat(body.weight) : undefined;
      tags = body.tags || undefined;
      season = body.season || '';
      occasion = body.occasion || '';
      starred = body.starred !== undefined ? body.starred : undefined;
      ratings = body.ratings !== undefined ? parseFloat(body.ratings) : undefined;
      reviews = body.reviews !== undefined ? parseInt(body.reviews) : undefined;
      isInStock = body.isInStock !== undefined ? body.isInStock : undefined;
      soldCount = body.soldCount !== undefined ? parseInt(body.soldCount) : undefined;
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Collect old image URLs to delete if they are replaced
    const oldImageUrls = existingProduct.images?.map(image => image.url) || [];

    const updateData = {};
    const isImageUpdate = imageUrls.length > 0;
    if (isImageUpdate) {
      updateData.images = imageUrls.map(url => ({ url }));
      if (oldImageUrls.length > 0) {
        deleteFile(oldImageUrls);
      }
    }
    if (slug) updateData.slug = slug;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (colors) updateData.color = colors;
    if (sizes) updateData.size = sizes;
    if (category) updateData.category = category;
    if (material) updateData.material = material;
    if (brand !== undefined) updateData.brand = brand;
    if (stock !== undefined) {
      updateData.stock = stock;
      updateData.isInStock = stock > 0;
    }
    if (discount !== undefined) {
      updateData.discount = discount;
      updateData.originalPrice = originalPrice !== undefined ? originalPrice : (price !== undefined ? price : existingProduct.price);
    }
    if (gender) updateData.gender = gender;
    if (fit) updateData.fit = fit;
    if (sleeveLength) updateData.sleeveLength = sleeveLength;
    if (pattern) updateData.pattern = pattern;
    if (careInstructions) updateData.careInstructions = careInstructions;
    if (weight !== undefined) updateData.weight = weight;
    if (tags) updateData.tags = tags;
    if (season) updateData.season = season;
    if (occasion) updateData.occasion = occasion;
    if (starred !== undefined) updateData.starred = starred;
    if (ratings !== undefined) updateData.ratings = ratings;
    if (reviews !== undefined) updateData.reviews = reviews;
    if (isInStock !== undefined) updateData.isInStock = isInStock;
    if (soldCount !== undefined) updateData.soldCount = soldCount;

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
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: Object.values(error.errors).map(err => err.message).join(', ') }, { status: 400 });
    }
    if (error.message.includes('Only images') || error.message.includes('File size')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}