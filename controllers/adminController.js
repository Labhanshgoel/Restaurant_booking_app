const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalRestaurantOwners = await User.countDocuments({ role: 'restaurant_owner' });
    const totalOrders = await Order.countDocuments();
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalRestaurants,
          totalRestaurantOwners,
          totalOrders
        },
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all restaurants
// @route   GET /api/admin/restaurants
// @access  Private/Admin
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).populate('owner', 'name email');
    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  getAllRestaurants
};