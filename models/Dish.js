const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a dish name'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'soup', 'salad']
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra_hot'],
    default: 'mild'
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: String
}, {
  timestamps: true
});

// add a text index for name + description to support full-text search
dishSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Dish', dishSchema);