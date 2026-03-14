const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

router.get("/me", authMiddleware, userController.getProfile);
router.get("/orders", authMiddleware, userController.getUserOrders);

module.exports = router;