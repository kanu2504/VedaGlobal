import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productName: {
    type: String,
    default: 'General Inquiry',
    trim: true
  },
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  contactPerson: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  quantity: {
    type: Number,
    default: 1
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  enquiryType: {
    type: String,
    enum: ['Product Enquiry', 'Bulk Order', 'Partnership', 'Other'],
    default: 'Product Enquiry'
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Replied', 'Closed'],
    default: 'Pending'
  },
  mode: {
    type: String,
    enum: ['Retail', 'Wholesale'],
    default: 'Wholesale'
  }
}, {
  timestamps: true
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
