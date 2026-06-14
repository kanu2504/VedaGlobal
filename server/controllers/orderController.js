import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Place a new order (B2C)
// @route   POST /api/orders
// @access  Public
export const placeOrder = async (req, res) => {
  const { customerName, email, phone, address, items, paymentMode, mode, pincode } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Verify prices and build items structure
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.productName} not found` });
      }
      
      const itemPrice = dbProduct.price || 0;
      totalAmount += itemPrice * item.quantity;

      orderItems.push({
        productId: dbProduct._id,
        productName: dbProduct.name,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    const order = new Order({
      customerName,
      email,
      phone,
      address,
      items: orderItems,
      totalAmount,
      paymentMode: paymentMode || 'Cash on Delivery',
      orderStatus: 'Pending',
      mode: mode || 'Retail',
      pincode: pincode || ''
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus || order.orderStatus;
      const updated = await order.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await Order.deleteOne({ _id: order._id });
      res.json({ message: 'Order removed successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
