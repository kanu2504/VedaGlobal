import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Enquiry from '../models/Enquiry.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Setting from '../models/Setting.js';

// Generate JWT helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vedaglobalsecret123', {
    expiresIn: '30d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        name: admin.name || 'Super Admin',
        phone: admin.phone || '',
        avatar: admin.avatar || 'A',
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid admin email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Admin Profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.email = req.body.email || admin.email;
    admin.name = req.body.name || admin.name;
    admin.phone = req.body.phone !== undefined ? req.body.phone : admin.phone;
    admin.avatar = req.body.avatar !== undefined ? req.body.avatar : admin.avatar;

    if (req.body.password) {
      admin.password = req.body.password;
    }

    const updatedAdmin = await admin.save();
    
    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      phone: updatedAdmin.phone,
      avatar: updatedAdmin.avatar,
      token: generateToken(updatedAdmin._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    // Mode setting
    const modeSetting = await Setting.findOne({ key: 'mode' });
    const activeMode = modeSetting ? modeSetting.value : 'B2C';
    
    // Count products by category
    const categoriesCount = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // B2C vs B2B counts
    const b2cCount = await Product.countDocuments({
      $or: [
        { modeVisibility: 'B2C' },
        { modeVisibility: { $all: ['B2C'] } },
        { b2cVisible: true }
      ]
    });
    const b2bCount = await Product.countDocuments({
      $or: [
        { modeVisibility: 'B2B' },
        { modeVisibility: { $all: ['B2B'] } },
        { b2bVisible: true }
      ]
    });

    // Enquiries by Status
    const enquiriesStatusCount = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Orders by Status
    const ordersStatusCount = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Monthly trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyEnquiries = await Enquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalProducts,
      totalEnquiries,
      totalCategories,
      totalOrders,
      totalCustomers,
      activeMode,
      categoriesCount,
      b2cCount,
      b2bCount,
      enquiriesStatusCount,
      ordersStatusCount,
      monthlyOrders,
      monthlyEnquiries,
      recentEnquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
