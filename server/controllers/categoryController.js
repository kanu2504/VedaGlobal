import Category from '../models/Category.js';

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' }).sort({ displayOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories for admin (Active and Inactive)
// @route   GET /api/categories/admin
// @access  Private (Admin)
export const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res) => {
  const { name, image, status, displayOrder } = req.body;

  try {
    const slug = generateSlug(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const category = new Category({
      name,
      slug,
      image: image || '',
      status: status || 'Active',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0
    });

    const created = await category.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res) => {
  const { name, image, status, displayOrder } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      if (name && name !== category.name) {
        category.name = name;
        category.slug = generateSlug(name);
      }
      category.image = image !== undefined ? image : category.image;
      category.status = status || category.status;
      category.displayOrder = displayOrder !== undefined ? Number(displayOrder) : category.displayOrder;

      const updated = await category.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.deleteOne({ _id: category._id });
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
