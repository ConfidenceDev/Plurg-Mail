require("dotenv/config");
const path = require("path");
const express = require("express");
const app = express();
const mainRoute = require("./routes/main");
const cors = require("./cors/cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.use(mainRoute);

const PORT = process.env.PORT || 5001;
app.use(cors);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
