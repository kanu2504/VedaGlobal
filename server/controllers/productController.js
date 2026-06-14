import Product from '../models/Product.js';

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

// @desc    Get all products with search & category & visibility filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const { category, search, limit, mode } = req.query;

  try {
    const query = { status: 'Active' };

    // If query has category slug or name
    if (category && category !== 'All') {
      query.category = category;
    }

    const andConditions = [];

    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Filter by visibility mode
    if (mode === 'B2B') {
      andConditions.push({
        $or: [
          { modeVisibility: 'B2B' },
          { b2bVisible: true }
        ]
      });
    } else if (mode === 'B2C') {
      andConditions.push({
        $or: [
          { modeVisibility: 'B2C' },
          { b2cVisible: true }
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductById = async (req, res) => {
  const param = req.params.id; // note: router has :id
  try {
    let product;
    // Check if it's a valid ObjectId
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(param);
    } else {
      product = await Product.findOne({ slug: param });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    category,
    shortDescription,
    description,
    image,
    price,
    specifications,
    benefits,
    packagingOptions,
    stockStatus,
    b2bVisible,
    b2cVisible,
    modeVisibility,
    units,
    packSizes,
    minOrderQuantity,
    retailPrice,
    wholesalePrice,
    stockQuantity,
    featured,
    isFeatured,
    bestseller,
    isBestSeller,
    status
  } = req.body;

  try {
    const slug = generateSlug(name);
    
    // Ensure slug is unique
    const existing = await Product.findOne({ slug });
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = new Product({
      name,
      slug: finalSlug,
      category,
      shortDescription,
      description,
      image,
      price: price !== undefined ? Number(price) : 0,
      specifications: specifications || [],
      benefits: benefits || [],
      packagingOptions: packagingOptions || [],
      stockStatus: stockStatus || 'In Stock',
      b2bVisible: b2bVisible !== undefined ? b2bVisible : true,
      b2cVisible: b2cVisible !== undefined ? b2cVisible : true,
      modeVisibility: modeVisibility || ['B2C', 'B2B'],
      units: units || 'Kg',
      packSizes: packSizes || '1kg',
      minOrderQuantity: minOrderQuantity !== undefined ? Number(minOrderQuantity) : 1,
      retailPrice: retailPrice !== undefined ? Number(retailPrice) : 0,
      wholesalePrice: wholesalePrice !== undefined ? Number(wholesalePrice) : 0,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0,
      featured: featured || isFeatured || false,
      isFeatured: isFeatured || featured || false,
      bestseller: bestseller || isBestSeller || false,
      isBestSeller: isBestSeller || bestseller || false,
      status: status || 'Active'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res) => {
  const {
    name,
    category,
    shortDescription,
    description,
    image,
    price,
    specifications,
    benefits,
    packagingOptions,
    stockStatus,
    b2bVisible,
    b2cVisible,
    modeVisibility,
    units,
    packSizes,
    minOrderQuantity,
    retailPrice,
    wholesalePrice,
    stockQuantity,
    featured,
    isFeatured,
    bestseller,
    isBestSeller,
    status
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (name && name !== product.name) {
        product.name = name;
        const slug = generateSlug(name);
        const existing = await Product.findOne({ slug, _id: { $ne: product._id } });
        product.slug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
      }
      
      product.category = category || product.category;
      product.shortDescription = shortDescription || product.shortDescription;
      product.description = description || product.description;
      product.image = image || product.image;
      product.price = price !== undefined ? Number(price) : product.price;
      product.specifications = specifications !== undefined ? specifications : product.specifications;
      product.benefits = benefits !== undefined ? benefits : product.benefits;
      product.packagingOptions = packagingOptions !== undefined ? packagingOptions : product.packagingOptions;
      product.stockStatus = stockStatus || product.stockStatus;
      product.b2bVisible = b2bVisible !== undefined ? b2bVisible : product.b2bVisible;
      product.b2cVisible = b2cVisible !== undefined ? b2cVisible : product.b2cVisible;
      product.modeVisibility = modeVisibility !== undefined ? modeVisibility : product.modeVisibility;
      product.units = units || product.units;
      product.packSizes = packSizes || product.packSizes;
      product.minOrderQuantity = minOrderQuantity !== undefined ? Number(minOrderQuantity) : product.minOrderQuantity;
      product.retailPrice = retailPrice !== undefined ? Number(retailPrice) : product.retailPrice;
      product.wholesalePrice = wholesalePrice !== undefined ? Number(wholesalePrice) : product.wholesalePrice;
      product.stockQuantity = stockQuantity !== undefined ? Number(stockQuantity) : product.stockQuantity;
      product.featured = featured !== undefined ? featured : product.featured;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      // sync both
      if (featured !== undefined) product.isFeatured = featured;
      if (isFeatured !== undefined) product.featured = isFeatured;

      product.bestseller = bestseller !== undefined ? bestseller : product.bestseller;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
      // sync both
      if (bestseller !== undefined) product.isBestSeller = bestseller;
      if (isBestSeller !== undefined) product.bestseller = isBestSeller;

      product.status = status || product.status;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
