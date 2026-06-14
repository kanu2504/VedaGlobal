import FAQ from '../models/FAQ.js';

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create FAQ
export const createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = new FAQ({ question, answer });
    const created = await faq.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      faq.question = question || faq.question;
      faq.answer = answer || faq.answer;
      const updated = await faq.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      await FAQ.deleteOne({ _id: req.params.id });
      res.json({ message: 'FAQ removed' });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
