const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  username: String,
  checkin: String,
  checkout: String
});
module.exports = mongoose.model('Booking', bookingSchema);
