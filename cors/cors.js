const cors = require("cors");

const corsHeader = {
  origin: [
    "https://plurg.me",
    "https://plurg.herokuapp.com",
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
