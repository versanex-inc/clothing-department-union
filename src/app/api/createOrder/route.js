import { connectionStr } from '@/utils/db';
import order from '@/utils/models/order';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const { slug, fullName, phoneNumber, address, productTitle, price, quantity, totalPrice, imageUrl, selectedSize, selectedColor } = await request.json();

    if (!slug || !fullName || !phoneNumber || !address || !productTitle || !price || !quantity || !totalPrice || !imageUrl || !selectedSize || !selectedColor) {
      return NextResponse.json(
        { error: 'All fields (slug, fullName, phoneNumber, address, productTitle, price, quantity, totalPrice, imageUrl, selectedSize, selectedColor) are required' },
        { status: 400 }
      );
    }

    const newOrder = new order({
      slug,
      fullName,
      phoneNumber,
      address,
      productTitle,
      price,
      totalPrice,
      quantity,
      imageUrl,
      selectedSize,
      selectedColor,
      paymentMethod: 'Cash on Delivery',
    });
    await newOrder.save();

    return NextResponse.json(
      { message: 'Order created successfully', order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}