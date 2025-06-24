import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Product } from '@/utils/models/product';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  let result; // Declare result in outer scope
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => console.log('Connected to MongoDB'));

    const { price, originalPrice, resetOriginalPrice } = await request.json();

    console.log('Fetching products before update...');
    const beforeUpdate = await Product.countDocuments();
    console.log(`Total products before update: ${beforeUpdate}`);

    if (resetOriginalPrice) {
      console.log('Resetting original prices to zero...');
      result = await Product.updateMany({}, { $set: { originalPrice: 0 } });
      console.log(`Reset result: ${JSON.stringify(result)}`);
    } else {
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
        throw new Error('Invalid price provided');
      }
      const newPrice = parseFloat(price);
      const newOriginalPrice = originalPrice && !isNaN(parseFloat(originalPrice)) && parseFloat(originalPrice) >= 0 ? parseFloat(originalPrice) : undefined;

      console.log('Updating prices...');
      const updateData = { price: newPrice, 'variants.$[].price': newPrice };
      if (newOriginalPrice !== undefined) {
        updateData.originalPrice = newOriginalPrice;
      }
      result = await Product.updateMany({}, { $set: updateData });
      console.log(`Update result: ${JSON.stringify(result)}`);
    }

    console.log('Fetching products after update...');
    const afterUpdate = await Product.countDocuments();
    console.log(`Total products after update: ${afterUpdate}`);

    revalidatePath('/shop'); // Revalidate shop page
    return NextResponse.json({ message: 'Prices updated successfully', updatedCount: result.modifiedCount }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error updating prices', details: error.message }, { status: 500 });
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}