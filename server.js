const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const Booking = require('./models/booking');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentUser = null;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/wonderland-hotel');

// Login
app.post('/login', async (req, res) => {
  const { role, username, email, phone } = req.body;
  currentUser = await User.findOneAndUpdate(
    { email },
    { username, phone, role },
    { upsert: true, new: true }
  );
  if (role === 'customer') {
    res.redirect('/dashboard_customer.html');
  } else {
    res.redirect('/dashboard_admin.html');
  }
});

// Customer Info API
app.get('/user-info', (req, res) => {
  res.json({
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
});

// Book Room
app.post('/book', async (req, res) => {
  await Booking.create({
    username: currentUser?.username,
    checkin: req.body.checkin,
    checkout: req.body.checkout
  });
  res.sendStatus(200);
});

// Admin Stats
app.get('/admin-stats', async (req, res) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalBookings = await Booking.countDocuments();
  res.json({ totalCustomers, totalBookings });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
