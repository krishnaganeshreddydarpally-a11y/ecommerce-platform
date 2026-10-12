import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    avatar: { type: String },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Folder' },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    categoryName: { type: String },
    rating: { type: Number, default: 5.0 },
    numReviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    specs: { type: Map, of: String, default: {} },
    reviews: {
      type: [
        {
          id: String,
          userId: String,
          userName: String,
          rating: Number,
          comment: String,
          createdAt: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    customerName: { type: String },
    customerEmail: { type: String },
    items: {
      type: [
        {
          id: String,
          name: String,
          price: Number,
          quantity: Number,
          image: String,
        },
      ],
      default: [],
    },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, default: 'Credit Card' },
    paymentStatus: { type: String, default: 'Paid' },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, default: 'Processing' },
    trackingNumber: { type: String },
    timeline: {
      type: [
        {
          status: String,
          timestamp: String,
          note: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
