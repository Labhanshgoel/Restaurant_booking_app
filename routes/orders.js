const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getRestaurantOrders,
  updateOrderStatus,
  getOrder 
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('user'), createOrder);

router.get('/my-orders', authorize('user'), getUserOrders);
router.get('/restaurant/:restaurantId', authorize('restaurant_owner', 'admin'), getRestaurantOrders);

router.route('/:id')
  .get(getOrder);

router.put('/:id/status', authorize('restaurant_owner', 'admin'), updateOrderStatus);

module.exports = router;