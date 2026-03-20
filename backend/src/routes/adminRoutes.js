const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const adminProductController = require("../controllers/admin/adminProductController");
const adminReviewController = require("../controllers/admin/adminReviewController");
const adminSampleController = require("../controllers/admin/adminSampleController");
const adminOrderController = require("../controllers/admin/adminOrderController");
const adminAnnouncementController = require("../controllers/admin/adminAnnouncementController");
const adminSettingsController = require("../controllers/admin/adminSettingsController");
const adminCategoryController = require("../controllers/admin/adminCategoryController");
const adminDashboardController = require("../controllers/admin/adminDashboardController");

router.use(adminMiddleware);

/* DASHBOARD */
router.get("/dashboard", adminDashboardController.getDashboard);

/* PRODUCT MANAGEMENT */

router.post("/products", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'storyImages', maxCount: 5 }]), adminProductController.createProduct);
router.put("/products/:id", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'storyImages', maxCount: 5 }]), adminProductController.updateProduct);
router.delete("/products/:id", adminProductController.deleteProduct);
router.get("/products", adminProductController.getAllProducts);

/* CATEGORY MANAGEMENT */

router.post("/categories", upload.single("image"), adminCategoryController.createCategory);
router.put("/categories/:id", upload.single("image"), adminCategoryController.updateCategory);
router.delete("/categories/:id", adminCategoryController.deleteCategory);
router.get("/categories", adminCategoryController.getAllCategories);

/* REVIEW MANAGEMENT */

router.post("/reviews", adminReviewController.createReview);
router.put("/reviews/:id", adminReviewController.updateReview);
router.delete("/reviews/:id", adminReviewController.deleteReview);
router.get("/reviews", adminReviewController.getAllReviews);


/* SAMPLE MANAGEMENT */

router.post("/samples", adminSampleController.createSample);
router.put("/samples/:id", adminSampleController.updateSample);
router.delete("/samples/:id", adminSampleController.deleteSample);
router.get("/samples", adminSampleController.getAllSamples);


/* ANNOUNCEMENTS */

router.post("/announcements", adminAnnouncementController.createAnnouncement);
router.put("/announcements/:id", adminAnnouncementController.updateAnnouncement);
router.delete("/announcements/:id", adminAnnouncementController.deleteAnnouncement);
router.get("/announcements", adminAnnouncementController.getAllAnnouncements);


/* ORDERS */

router.get("/orders", adminOrderController.getAllOrders);
router.get("/orders/:orderId", adminOrderController.getOrderDetails);
router.patch("/orders/:orderId/status", adminOrderController.updateOrderStatus);


/* SETTINGS */

router.put("/settings/free-samples", adminSettingsController.updateFreeSampleSettings);

module.exports = router;
