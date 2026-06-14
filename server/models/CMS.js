import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

const CMS = mongoose.model('CMS', cmsSchema);
export default CMS;
