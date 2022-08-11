const cors = require("cors");

const corsHeader = {
  origin: [
    "https://www.plurg.me",
    "https://plurg.onrender.com",
    "http:localhost:4732/",
  ],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "X-Requested-With",
    "X-Access-Token",
    "Content-Type",
    "Host",
    "Accept",
    "Connection",
    "Cache-Control",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsHeader);
