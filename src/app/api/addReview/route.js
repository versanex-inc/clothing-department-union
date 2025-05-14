import { connectionStr } from '@/utils/db';
import { Review } from '@/utils/models/review';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const { name, quote, rating } = await request.json();

    if (!name || !quote || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'All fields (name, quote, rating) are required and rating must be between 1 and 5' }, { status: 400 });
    }

    const newReview = new Review({ name, quote, rating });
    await newReview.save();

    return NextResponse.json({ message: 'Review submitted for approval', review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}