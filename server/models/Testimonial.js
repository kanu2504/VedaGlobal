import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  countryCity: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    trim: true
  },
  showOnHomepage: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
