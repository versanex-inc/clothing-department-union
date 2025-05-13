import mongoose from 'mongoose';

// Product Schema for Clothing
const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ url: String }], // Array of image URLs
  slug: { type: String, unique: true, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 }, // Price before discount
  color: [{ type: String, required: true }], // Array of available colors
  size: [{ type: String, required: true }], // Array of available sizes
  variants: [
    {
      color: String,
      size: String,
      price: { type: Number, min: 0 }, // Variant-specific price
      stock: { type: Number, default: 0, min: 0 }, // Variant-specific stock
      image: { url: String }, // Variant-specific image
      sku: String // Unique SKU for this variant
    }
  ],
  category: { type: String, required: true, enum: ['Anime', 'Trending', 'Casual', 'Memes', 'Sports'] },
  material: { type: String, required: true },
  brand: { type: String },
  stock: { type: Number, default: 0, min: 0 }, // Total stock (can be used if not using variants)
  discount: { type: Number, default: 0, min: 0, max: 100 },
  gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
  fit: { type: String, enum: ['slim', 'regular', 'loose'] },
  sleeveLength: { type: String, enum: ['short sleeve', 'long sleeve', 'sleeveless'] }, // For shirts
  pattern: { type: String, enum: ['solid', 'striped', 'checkered', 'printed'] },
  careInstructions: { type: String }, // E.g., "Machine washable"
  weight: { type: Number, min: 0 }, // Weight in grams for shipping
  tags: [{ type: String }], // For search and filtering
  ratings: { type: Number, default: 0, min: 0, max: 5 }, // Average rating
  reviews: { type: Number, default: 0, min: 0 }, // Number of reviews
  season: { type: String, enum: ['winter', 'summer', 'spring', 'fall', 'all seasons'] },
  occasion: { type: String, enum: ['casual', 'formal', 'party', 'sportswear'] },
  isInStock: { type: Boolean, default: true }, // Quick availability check
  starred: { type: Boolean, default: false }, // Field for featuring products
  soldCount: { type: Number, default: 0, min: 0 }, // Number of items sold
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productsSchema);