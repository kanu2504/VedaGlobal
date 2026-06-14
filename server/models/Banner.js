import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  desktopImage: {
    type: String,
    required: true
  },
  mobileImage: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  linkButton: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
