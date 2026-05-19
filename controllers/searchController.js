const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

// @desc    Search restaurants and dishes
// @route   GET /api/search?q=...&type=restaurants|dishes|all
// @access  Public
const search = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const type = (req.query.type || 'all').toLowerCase();

    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter `q` is required' });
    }

    const regex = new RegExp(q, 'i');
    // allow client to request a smaller result set for suggestions
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const results = {};

    if (type === 'restaurants' || type === 'all') {
      results.restaurants = await Restaurant.find({
        isActive: true,
        $or: [
          { name: regex },
          { cuisine: regex },
          { 'address.city': regex }
        ]
      })
      .limit(limit)
      .populate('owner', 'name email');
    }

    if (type === 'dishes' || type === 'all') {
      // prefer text search if available, fallback to regex
      const textSearch = await Dish.find({ $text: { $search: q } }).limit(limit).populate('restaurant', 'name');
      if (textSearch && textSearch.length) {
        results.dishes = textSearch;
      } else {
        results.dishes = await Dish.find({
          $or: [ { name: regex }, { description: regex } ]
        }).limit(limit).populate('restaurant', 'name');
      }
    }

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { search };
