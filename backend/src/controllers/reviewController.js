const Review = require("../models/Review");

exports.getReviewsByProduct = async (req, res) => {

    const reviews = await Review.find({
        productId: req.params.productId
    });

    res.json(reviews);

};

exports.createReview = async (req, res) => {
    try {
        const { productId, reviewerName, rating, reviewText } = req.body;
        const review = await Review.create({
            productId,
            reviewerName,
            rating,
            reviewText
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};