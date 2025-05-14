import { connectionStr } from '@/utils/db';
import { Review } from '@/utils/models/review';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    if (!connectionStr) throw new Error('MONGO_URI is not defined');
    if (mongoose.connection.readyState === 0) await mongoose.connect(connectionStr);

    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved') === 'true';

    const reviews = await Review.find({ approved }).sort({ rating: -1, createdAt: -1 });
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}