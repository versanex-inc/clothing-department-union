import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery', enum: ['Cash on Delivery'] },
  productTitle: { type: String, required: true },
  price: { type: Number, required: true }, // Base price
  totalPrice: { type: Number, required: true }, // Total price (price × quantity)
  quantity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, required: true },
  selectedSize: { type: String, required: true },
  selectedColor: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);