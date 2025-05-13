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

    let imageUrls = [], slug, title, description, price, colors, sizes, category, material, brand, stock, discount, gender, fit, sleeveLength, pattern, careInstructions, weight, tags, season, occasion;
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('images'); // Get all files under 'images' field
      imageUrls = files.length > 0 ? await saveFile(files) : (formData.get('imageUrl') ? [formData.get('imageUrl')] : []);
      slug = formData.get('slug') || '';
      title = formData.get('title') || '';
      description = formData.get('description') || '';
      price = parseFloat(formData.get('price')) || 0;
      colors = formData.get('color') ? formData.get('color').split(',') : [];
      sizes = formData.get('size') ? formData.get('size').split(',') : [];
      category = formData.get('category') || '';
      material = formData.get('material') || '';
      brand = formData.get('brand') || '';
      stock = parseInt(formData.get('stock')) || 0;
      discount = parseFloat(formData.get('discount')) || 0;
      gender = formData.get('gender') || '';
      fit = formData.get('fit') || '';
      sleeveLength = formData.get('sleeveLength') || '';
      pattern = formData.get('pattern') || '';
      careInstructions = formData.get('careInstructions') || '';
      weight = parseFloat(formData.get('weight')) || 0;
      tags = formData.get('tags') ? formData.get('tags').split(',') : [];
      season = formData.get('season') || '';
      occasion = formData.get('occasion') || '';
    } else {
      const body = await request.json();
      imageUrls = body.imageUrl ? [body.imageUrl] : (body.imageUrls || []);
      slug = body.slug || '';
      title = body.title || '';
      description = body.description || '';
      price = body.price || 0;
      colors = body.color || [];
      sizes = body.size || [];
      category = body.category || '';
      material = body.material || '';
      brand = body.brand || '';
      stock = body.stock || 0;
      discount = body.discount || 0;
      gender = body.gender || '';
      fit = body.fit || '';
      sleeveLength = body.sleeveLength || '';
      pattern = body.pattern || '';
      careInstructions = body.careInstructions || '';
      weight = body.weight || 0;
      tags = body.tags || [];
      season = body.season || '';
      occasion = body.occasion || '';
    }

    // Validate required fields
    if (!imageUrls.length || !slug || !title || !description || !price || !colors.length || !sizes.length || !category || !material || !gender) {
      return NextResponse.json({ error: 'All required fields (images, slug, title, description, price, color, size, category, material, gender) must be provided' }, { status: 400 });
    }

    // Create new product with all schema fields
    const newProduct = new Product({
      title,
      description,
      images: imageUrls.map(url => ({ url })), // Map URLs to array of objects
      slug,
      price,
      originalPrice: price, // Set originalPrice to price if no discount
      color: colors,
      size: sizes,
      category,
      material,
      brand,
      stock,
      discount,
      gender,
      fit,
      sleeveLength,
      pattern,
      careInstructions,
      weight,
      tags,
      season,
      occasion,
      isInStock: stock > 0, // Set isInStock based on stock value
      starred: false, // Default value as per schema
      soldCount: 0, // Default value as per schema
      ratings: 0, // Default value as per schema
      reviews: 0, // Default value as per schema
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json({ message: 'Product added successfully', product: savedProduct }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    if (error.code === 11000) return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: Object.values(error.errors).map(err => err.message).join(', ') }, { status: 400 });
    }
    if (error.message.includes('Only images') || error.message.includes('File size')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}