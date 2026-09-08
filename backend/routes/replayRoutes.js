const express = require("express");
const router = express.Router();

const replayController = require("../controllers/replayController");

router.post("/start", replayController.startReplay);

module.exports = router;