import mongoose from 'mongoose';

// Product Schema
const productsSchema = new mongoose.Schema({
  image: { url: String },
  slug: { type: String, unique: true },
  title: { type: String },
  productNumber: { type: Number },
  carName: { type: String },
  starred: { type: Boolean, default: false }, // New field for starring products
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productsSchema);