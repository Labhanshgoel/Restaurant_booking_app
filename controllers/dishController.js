const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');

// @desc    Add new dish
// @route   POST /api/dishes
// @access  Private/Restaurant Owner
const createDish = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Only restaurant owner or admin can add dishes
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to add dish to this restaurant'
      });
    }

    const dish = await Dish.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isAvailable: req.body.isAvailable,
      restaurant: req.body.restaurant
    });

    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all dishes
// @route   GET /api/dishes
// @access  Public
const getDishes = async (req, res) => {
  // Return all dishes
  try {
    const dishes = await Dish.find();
    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dishes by restaurant
// @route   GET /api/dishes/restaurant/:restaurantId
// @access  Public
const getDishesByRestaurant = async (req, res) => {
  // Return dishes for a specific restaurant
  try {
    const dishes = await Dish.find({ restaurant: req.params.restaurantId });
    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a dish
// @route   PUT /api/dishes/:id
// @access  Private/Restaurant Owner
const updateDish = async (req, res) => {
  // Update a dish
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a dish
// @route   DELETE /api/dishes/:id
// @access  Private/Restaurant Owner
const deleteDish = async (req, res) => {
  // Delete a dish
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.json({ success: true, message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDish,
  getDishes,
  getDishesByRestaurant,
  updateDish,
  deleteDish
};