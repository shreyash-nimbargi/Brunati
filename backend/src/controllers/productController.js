const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
    const { category, search, accord, note } = req.query;

    let filter = {};

    if (category && category !== "all") {
        filter.category = category;
    }

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    if (accord) {
        filter.mainAccords = { $in: [accord] };
    }

    if (note) {
        filter.$or = [
            { "perfumePyramid.top": { $in: [note] } },
            { "perfumePyramid.middle": { $in: [note] } },
            { "perfumePyramid.base": { $in: [note] } },
        ];
    }

    const products = await Product.find(filter);
    res.json(products);
};

exports.getProductBySlug = async (req, res) => {

    const product = await Product.findOne({ slug: req.params.slug });

    res.json(product);

};
