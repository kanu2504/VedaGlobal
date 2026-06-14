import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  image: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  priceRange: {
    type: String,
    default: 'Negotiable / Quote-based'
  },
  origin: {
    type: String,
    default: 'India'
  },
  moq: {
    type: String,
    default: '20 Metric Tons (1 FCL)'
  },
  packaging: {
    type: String,
    default: 'Standard Export Quality Packaging / Custom Available'
  },
  exportMarkets: [{
    type: String
  }],
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  specifications: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  packagingOptions: [{
    type: String,
    trim: true
  }],
  stockStatus: {
    type: String,
    required: true,
    enum: ['In Stock', 'Out of Stock', 'On Backorder'],
    default: 'In Stock'
  },
  b2bVisible: {
    type: Boolean,
    default: true
  },
  b2cVisible: {
    type: Boolean,
    default: true
  },
  modeVisibility: {
    type: [String],
    enum: ['B2C', 'B2B'],
    default: ['B2C', 'B2B']
  },
  units: {
    type: String,
    enum: ['Gram', 'Kg', 'Quintal', 'Ton', 'Packet', 'Box', 'Bottle', 'Liter', 'Piece'],
    default: 'Kg'
  },
  packSizes: {
    type: String,
    enum: ['100g', '250g', '500g', '1kg', '5kg', '10kg', '25kg', '50kg', 'Custom'],
    default: '1kg'
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  retailPrice: {
    type: Number,
    default: 0
  },
  wholesalePrice: {
    type: Number,
    default: 0
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  bestseller: {
    type: Boolean,
    default: false,
    index: true
  },
  isBestSeller: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
