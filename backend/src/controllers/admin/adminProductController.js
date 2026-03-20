const Product = require("../../models/Product");
const { deleteMultipleFromCloudinary } = require("../../utils/cloudinaryHelper");

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
        res.status(201).json({ status: true, message: "Product created successfully", data: product });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
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
            return res.status(404).json({ status: false, message: "Product not found", data: null });
        }

        // Delete old images from Cloudinary if new ones are uploaded
        if (req.files) {
            if (req.files.images && product.images && product.images.length > 0) {
                await deleteMultipleFromCloudinary(product.images);
            }
            if (req.files.storyImages && product.story && product.story.storyImages && product.story.storyImages.length > 0) {
                await deleteMultipleFromCloudinary(product.story.storyImages);
            }
        }

        Object.assign(product, productData);
        await product.save();

        res.json({ status: true, message: "Product updated successfully", data: product });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message, data: null });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found", data: null });
        }

        // Delete all images from Cloudinary
        const allImages = [...(product.images || [])];
        if (product.story && product.story.storyImages) {
            allImages.push(...product.story.storyImages);
        }

        if (allImages.length > 0) {
            await deleteMultipleFromCloudinary(allImages);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ status: true, message: "Product deleted successfully", data: null });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ status: true, message: "Products fetched successfully", data: products });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};
