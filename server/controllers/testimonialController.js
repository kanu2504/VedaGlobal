import Testimonial from '../models/Testimonial.js';

// Get active testimonials
export const getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ showOnHomepage: true });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all testimonials (Admin)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create testimonial
export const createTestimonial = async (req, res) => {
  const { customerName, countryCity, rating, reviewText, productName, showOnHomepage } = req.body;
  try {
    const testimonial = new Testimonial({ customerName, countryCity, rating: Number(rating), reviewText, productName, showOnHomepage });
    const created = await testimonial.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
  const { customerName, countryCity, rating, reviewText, productName, showOnHomepage } = req.body;
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      testimonial.customerName = customerName || testimonial.customerName;
      testimonial.countryCity = countryCity !== undefined ? countryCity : testimonial.countryCity;
      testimonial.rating = rating !== undefined ? Number(rating) : testimonial.rating;
      testimonial.reviewText = reviewText || testimonial.reviewText;
      testimonial.productName = productName !== undefined ? productName : testimonial.productName;
      testimonial.showOnHomepage = showOnHomepage !== undefined ? showOnHomepage : testimonial.showOnHomepage;
      const updated = await testimonial.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      await Testimonial.deleteOne({ _id: req.params.id });
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
