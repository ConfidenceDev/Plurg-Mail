const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide a valid email address."],
    unique: true,
  },
  credit: {
    type: Number,
    default: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Users", user);
