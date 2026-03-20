const Review = require("../../models/Review");

exports.createReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json({ status: true, message: "Review created successfully", data: review });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!review) {
            return res.status(404).json({ status: false, message: "Review not found", data: null });
        }
        res.json({ status: true, message: "Review updated successfully", data: review });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ status: false, message: "Review not found", data: null });
        }
        res.json({ status: true, message: "Review deleted successfully", data: null });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("productId").sort({ createdAt: -1 });
        res.json({ status: true, message: "Reviews fetched successfully", data: reviews });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};
