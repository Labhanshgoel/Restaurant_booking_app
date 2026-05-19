const express = require('express');
const { 
  createDish, 
  getDishes, 
  getDishesByRestaurant,
  updateDish,
  deleteDish 
} = require('../controllers/dishController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.route('/')
  .get(getDishes)
  .post(protect, authorize('restaurant_owner', 'admin'), createDish);

router.get('/restaurant/:restaurantId', getDishesByRestaurant);

router.route('/:id')
  .put(protect, authorize('restaurant_owner', 'admin'), updateDish)
  .delete(protect, authorize('restaurant_owner', 'admin'), deleteDish);

module.exports = router;