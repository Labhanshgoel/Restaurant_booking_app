const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/User
const createOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, specialInstructions } = req.body;

    // Validate restaurant
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Validate dishes and calculate total
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const dish = await Dish.findById(item.dish);
      if (!dish || !dish.isAvailable) {
        return res.status(400).json({ success: false, message: `Dish not available: ${item.dish}` });
      }
      orderItems.push({
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price
      });
      totalAmount += dish.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      specialInstructions
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders for current user
// @route   GET /api/orders/my-orders
// @access  Private/User
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name')
      .populate('items.dish', 'name price');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders for a restaurant
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private/Restaurant Owner/Admin
const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    // Only owner or admin can view
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email')
      .populate('items.dish', 'name price');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Restaurant Owner/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Only owner or admin can update
    if (order.restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    order.status = req.body.status || order.status;
    if (req.body.estimatedDeliveryTime) {
      order.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    }
    if (req.body.actualDeliveryTime) {
      order.actualDeliveryTime = req.body.actualDeliveryTime;
    }
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .populate('items.dish', 'name price');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Only user, owner, or admin can view
    if (
      order.user.toString() !== req.user.id &&
      order.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus,
  getOrder
};