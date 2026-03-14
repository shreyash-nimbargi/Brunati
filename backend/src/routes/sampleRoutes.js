const express = require("express");
const router = express.Router();
const sampleController = require("../controllers/sampleController");

router.get("/available", sampleController.getAvailableSamples);

module.exports = router;