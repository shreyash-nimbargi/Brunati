const Product = require("../../models/Product");

const parseBody = (body) => {
    const parsed = { ...body };
    ['sizes', 'mainAccords', 'perfumePyramid', 'story'].forEach(field => {
        if (parsed[field] && typeof parsed[field] === 'string') {
            try {
                parsed[field] = JSON.parse(parsed[field]);
            } catch (e) {
                // Keep as is if not valid JSON
            }
        }
    });
    return parsed;
};

exports.createProduct = async (req, res) => {
    try {
        const productData = parseBody(req.body);

        // Handle uploaded images
        if (req.files) {
            if (req.files.images) {
                productData.images = req.files.images.map(file => file.path);
            }
            if (req.files.storyImages) {
                if (!productData.story) productData.story = {};
                productData.story.storyImages = req.files.storyImages.map(file => file.path);
            }
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productData = parseBody(req.body);

        // Handle uploaded images
        if (req.files) {
            if (req.files.images) {
                productData.images = req.files.images.map(file => file.path);
            }
            if (req.files.storyImages) {
                if (!productData.story) productData.story = {};
                productData.story.storyImages = req.files.storyImages.map(file => file.path);
            }
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        Object.assign(product, productData);
        await product.save();

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
