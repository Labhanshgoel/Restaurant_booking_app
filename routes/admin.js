const express = require('express');
const { getDashboard, getAllUsers, getAllRestaurants } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/restaurants', getAllRestaurants);

module.exports = router;