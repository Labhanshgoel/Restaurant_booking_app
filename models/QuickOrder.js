const mongoose = require('mongoose');

const quickOrderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuickOrder', quickOrderSchema);
