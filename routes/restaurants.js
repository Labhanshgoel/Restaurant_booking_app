const express = require('express');
const { 
  createRestaurant, 
  getRestaurants, 
  getRestaurant, 
  updateRestaurant,
  getMyRestaurants,
  searchNearby
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../config/multer');

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('restaurant_owner', 'admin'), upload.single('image'), createRestaurant);

router.get('/search/nearby', searchNearby);

router.get('/owner/me', protect, authorize('restaurant_owner', 'admin'), getMyRestaurants);

router.route('/:id')
  .get(getRestaurant)
  .put(protect, authorize('restaurant_owner', 'admin'), upload.single('image'), updateRestaurant);

module.exports = router;