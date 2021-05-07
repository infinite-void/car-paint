const express = require("express");
const router = express.Router();

const auth = require("../controllers/admin");
const tokenauth = require("../controllers/auth");
const queue = require("../controllers/queue");

router.post("/login", auth.adminAuth);
router.post("/addqueue", tokenauth.adminAuth, queue.addQueue);
router.post("/changecolor", tokenauth.adminAuth, queue.adminchangeColor);
router.post("/getposition", tokenauth.adminAuth, queue.getPosition);
router.post("/getqueue", tokenauth.adminAuth, queue.admingetQueue);
router.post("/abort", tokenauth.adminAuth, queue.adminAbort);
router.post("/blockcolor", tokenauth.adminAuth, queue.blockColor);
router.post("/resumecolor", tokenauth.adminAuth, queue.allowColor);
router.post("/setqlength", tokenauth.adminAuth, queue.setqueuelength);

module.exports = router;