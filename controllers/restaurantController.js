const Restaurant = require('../models/Restaurant');

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private/Restaurant Owner
const createRestaurant = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    
    // Handle image upload
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    
    // Handle geolocation - convert latitude and longitude to GeoJSON format
    if (req.body.latitude && req.body.longitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
      // Remove the original fields as they're now in location
      delete req.body.latitude;
      delete req.body.longitude;
    }
    
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true })
      .populate('owner', 'name email');
    
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

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Restaurant Owner
const updateRestaurant = async (req, res) => {
  try {
    console.log('Update request for restaurant ID:', req.params.id);
    console.log('User ID:', req.user?.id);
    console.log('User role:', req.user?.role);
    console.log('Request body:', req.body);
    console.log('File uploaded:', req.file ? req.file.filename : 'No file');

    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      console.log('Restaurant not found');
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    console.log('Restaurant owner:', restaurant.owner ? restaurant.owner.toString() : 'No owner');

    // Make sure user is restaurant owner or admin
    if (!restaurant.owner || (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin')) {
      console.log('Authorization failed - user is not owner and not admin');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this restaurant. You must be the owner or an admin.'
      });
    }

    // Handle image upload
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
      console.log('Image path set to:', req.body.image);
    }

    // Handle geolocation - convert latitude and longitude to GeoJSON format
    if (req.body.latitude && req.body.longitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
      // Remove the original fields as they're now in location
      delete req.body.latitude;
      delete req.body.longitude;
      console.log('Location set to:', req.body.location);
    }

    console.log('Final update data:', req.body);

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    console.log('Updated restaurant:', restaurant);

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get restaurants by owner
// @route   GET /api/restaurants/owner/me
// @access  Private/Restaurant Owner
const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id });
    
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

// @desc    Search restaurants by location (nearby)
// @route   GET /api/restaurants/search/nearby
// @access  Public
const searchNearby = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const restaurants = await Restaurant.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) // in meters
        }
      }
    }).populate('owner', 'name email');

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
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  getMyRestaurants,
  searchNearby
};