const express = require("express");
const router = express.Router();

const queue = require("../controllers/queue");
const auth = require("../controllers/auth");

router.post("/addqueue", auth.tokenAuth, queue.addQueue);
router.post("/changecolor", auth.tokenAuth, queue.changeColor);
router.post("/getposition", auth.tokenAuth, queue.getPosition);
router.post("/getqueue", auth.tokenAuth, queue.getQueue);
router.post("/abort", auth.tokenAuth, queue.removeFromQueue);

module.exports = router;