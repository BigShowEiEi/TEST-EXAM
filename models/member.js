const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  title: { type: String, enum: ['นาย', 'นาง', 'นางสาว'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  age: { type: Number, required: true }, 
  profileImage: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
