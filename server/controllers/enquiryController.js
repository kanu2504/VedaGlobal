import Enquiry from '../models/Enquiry.js';

// @desc    Submit new enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  const {
    productId,
    productName,
    companyName,
    contactPerson,
    email,
    phone,
    country,
    quantity,
    message,
    enquiryType,
    mode
  } = req.body;

  try {
    if (!email || !phone || !message) {
      return res.status(400).json({ message: 'Please provide email, phone, and message' });
    }

    const name = contactPerson || req.body.name || 'Anonymous';

    const enquiry = new Enquiry({
      productId: productId || null,
      productName: productName || 'General Inquiry',
      companyName: companyName || '',
      contactPerson: name,
      email,
      phone,
      country: country || '',
      quantity: quantity !== undefined ? Number(quantity) : 1,
      message,
      enquiryType: enquiryType || 'Product Enquiry',
      status: 'Pending',
      mode: mode || 'Wholesale'
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
export const updateEnquiryStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = status || enquiry.status;
      const updated = await enquiry.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      await Enquiry.deleteOne({ _id: enquiry._id });
      res.json({ message: 'Enquiry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
