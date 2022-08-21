const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide a valid email address."],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Users", user);
