const router = require("express").Router();
const { connect, disconnect } = require("../util/db");
const {
  onStart,
  checkEmailIfExists,
  createPost,
  subscribeUser,
  unsubscribeUser,
  joinUser,
  removeUser,
  loadMail,
} = require("../controllers/main");

connect();

router.get("/start", async (req, res) => {
  onStart(req, res);
});

router.get("/check/:email", async (req, res) => {
  const data = req.params;
  if (data) {
    checkEmailIfExists(data, res);
  }
});

router.post("/posts", async (req, res) => {
  const data = req.body;
  if (data) {
    createPost(data, res);
  }
});

router.get("/subscription/:email", async (req, res) => {
  const data = req.params;
  if (data) {
    subscribeUser(data, res);
  }
});

router.get("/unsubscribe/:email", async (req, res) => {
  const data = req.params;
  if (data) {
    unsubscribeUser(data, res);
  }
});

router.get("/join/:email", async (req, res) => {
  const data = req.params;
  if (data) {
    joinUser(data, res);
  }
});

router.get("/remove/:email", async (req, res) => {
  const data = req.params;
  if (data) {
    removeUser(data, res);
  }
});

router.post("/load", async (req, res) => {
  const data = req.body;
  if (data) {
    loadMail(data, res);
  }
});

module.exports = router;
